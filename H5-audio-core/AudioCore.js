(factory => {
    let root = (typeof self === 'object' && self.self === self && self) ||
        (typeof global === 'object' && global.global === global && global);
    if (typeof define === 'function' && define.amd) {
        define([], () => {
            root.AudioCore = factory();
        });
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.AudioCore = factory();
    }
})(() => {
    let A = null, E = null;

    const shuffle_arr = (arr) => {
        arr = arr.slice();
        let new_arr = [];
        while (arr.length) {
            new_arr.push(arr.splice(Math.floor(Math.random() * arr.length), 1)[0]);
        }
        return new_arr;
    };

    const ON = {
        loadstart (e) {
            E['start'] && E['start'](A._list[A._cur]);
        },

        loadedmetadata (e) {
            let info = JSON.parse(JSON.stringify(A._list[A._cur]));
            info.duration = A.duration;
            E['loaded'] && E['loaded'](info);
        },

        timeupdate (e) {
            E['play'] && E['play']({
                cur: A.currentTime,
                total: A.duration
            });
        },

        progress (e) {
            let time_range = A.buffered;
            let buffered = [];
            for (let i = 0; i < time_range.length; i++) {
                buffered.push([time_range.start(i), time_range.end(i)])
            }
            if (buffered.length) E['buffer'] && E['buffer'](buffered);
        },

        ended (e) {
            switch (A._mode) {
                case 1: // loop
                    UTIL.play(A._cur);
                    break;
                default: // others
                    UTIL.play_next();
                    break;
            }
            E['end'] && E['end'](A._list[A._cur]);
        }
    };

    let LRC = {};

    const UTIL = {
        init ({
            list = [],
            cur = 0,
            mode = 0,
            vol = 0.8,
            play = false
        }) {
            window.A = A = document.createElement('audio'); // audio
            E = {}; // export events
            A._list = list; // [{src: './xxx.mp3', ...}, ...]
            A._rand = shuffle_arr(list.map((item, index) => index)); // for random mode
            A._cur = cur; // current index
            A._mode = mode; // 0: normal / 1: loop / 2: random
            A.volume = vol;
            for (let event in ON) {
                A.addEventListener(event, ON[event]);
            }
            if (play) UTIL.play(A._cur);
        },

        play (index) {
            if (index !== undefined) {
                A.src = A._list[index].src;
                A._cur = index;
            }
            A.play();
        },

        play_next () {
            let len = A._list.length;
            switch (A._mode) {
                case 2: // random
                    let r_cur = A._rand.indexOf(A._cur);
                    r_cur++;
                    if (r_cur >= len) {
                        r_cur = 0;
                    }
                    A._cur = A._rand[r_cur];
                    break;

                default: // others
                    A._cur++;
                    if (A._cur >= len) {
                        A._cur = 0;
                    }
                    break;
            }
            UTIL.play(A._cur);
        },

        play_pre () {
            let len = A._list.length;
            switch (A._mode) {
                case 2: // random
                    let r_cur = A._rand.indexOf(A._cur);
                    r_cur--;
                    if (r_cur < 0) {
                        r_cur = len - 1;
                    }
                    A._cur = A._rand[r_cur];
                    break;

                default: // others
                    A._cur--;
                    if (A._cur < 0) {
                        A._cur = len - 1;
                    }
                    break;
            }
            UTIL.play(A._cur);
        },

        vol (vol) {
            if (vol !== undefined) A.volume = vol;
            return A.volume;
        },

        pause () {
            A.pause();
        },

        mode (mode) {
            A._mode = typeof mode === 'number' ? Math.abs(mode) % 3 : 0;
        },

        to_time (sec) {
            if (!A.duration) return;
            let seekable = false;
            let time_range = A.seekable;
            for (let i = 0; i < time_range.length; i++) {
                if (sec >= time_range.start(i) && sec < time_range.end(i)) {
                    seekable = true;
                    break;
                }
            }
            if (!seekable) return;
            A.currentTime = sec;
        },

        on (event, callback) {
            E[event] = typeof callback === 'function' ? callback : undefined;
        },

        info () {
            return {
                cur: A._cur,
                vol: A.volume,
                mode: A._mode,
                paused: A.paused,
                duration: A.duration,
                time: A.currentTime,
                list: JSON.parse(JSON.stringify(A._list))
            }
        },

        list_add (item) {
            A._list.push(item);
            A._rand.splice(~~(Math.random() * A._list.length), 0, A._list.length - 1);
        },

        list_remove (index) {
            index = ~~index;
            if (index < 0 || index >= A._list.length) return;
            A._list.splice(index, 1);
            A._rand.splice(A._rand.indexOf(index), 1);
            A._rand = A._rand.map(val => val < index ? val : val - 1);
        },
        format_time (time) {
            time = ~~time;
            let [s, m] = [time % 60, ~~(time / 60)];
            return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
        },
        set_lrc (lrc_text) {
            let lrc_map = {};
            let rows = lrc_text.split('\n');
            let time_reg = /\[\d*:\d*((\.|:)\d*)*]/g;

            rows.forEach(row => {
                let time_arr = row.match(time_reg);
                if (!time_arr) return;
                let text = row.replace(time_reg, '').trim();
                time_arr.forEach(time => {
                    let [min, sec] = [
                        +time.match(/\[\d*/g)[0].slice(1),
                        +time.match(/:\d*/g)[0].slice(1),
                    ];
                    lrc_map[min * 60 + sec] = text;
                });
            });
            LRC = lrc_map;
            return lrc_map;
        },

        cur_lrc (sec, lrc_obj = LRC) {
            let time_arr = Object.keys(lrc_obj);
            time_arr.sort((pre, next) => +pre < +next ? 1 : -1);
            let ret = {};

            for (let i = 0; i < time_arr.length; i++) {
                let time = time_arr[i];
                if (sec > +time) {
                    ret = {time, lrc: lrc_obj[time]};
                    break;
                }
            }

            return ret;
        }
    };

    return UTIL;

});

