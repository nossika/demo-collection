(()=>{
    function shuffle_arr (arr) {
        arr = arr.slice();
        let new_arr = [];
        while (arr.length) {
            new_arr.push(arr.splice(Math.floor(Math.random() * arr.length), 1)[0]);
        }
        return new_arr;
    }
    let undercover = {

    };
    let avalon = () => {
        let _ctn, _board, _data;
        let _info = {
            map: {
                ML: {name: '梅林', camp: 'blue'},
                PX: {name: '派希维尔', camp: 'blue'},
                ZC: {name: '忠臣', camp: 'blue'},
                MG: {name: '莫安娜', camp: 'red'},
                CK: {name: '刺客', camp: 'red'},
                MD: {name: '莫德雷德', camp: 'red'},
                AB: {name: '奥伯伦', camp: 'red'},
                ZY: {name: '爪牙', camp: 'red'}
            },
            '5': {
                role: ['ML', 'PX', 'ZC', 'MG', 'CK'],
                vote: [2, 3, 2, 3, 3]
            },
            '6': {
                role: ['ML', 'PX', 'ZC', 'MG', 'CK', 'ZC'],
                vote: [2, 3, 4, 3, 4]
            },
            '7': {
                role: ['ML', 'PX', 'ZC', 'MG', 'CK', 'ZC', 'AB'],
                vote: [2, 3, 3, 4, 4]
            },
            '8': {
                role: ['ML', 'PX', 'ZC', 'MG', 'CK', 'ZC', 'ZC', 'ZY'],
                vote: [3, 4, 4, 5, 5]
            },
            '9': {
                role: ['ML', 'PX', 'ZC', 'MG', 'CK', 'ZC', 'ZC', 'ZC', 'MD'],
                vote: [3, 4, 4, 5, 5]
            },
            '10': {
                role: ['ML', 'PX', 'ZC', 'MG', 'CK', 'ZC', 'ZC', 'ZC', 'MD', 'AB'],
                vote: [3, 4, 4, 5, 5]
            },
        };
        let html = {
            init: `
                    <div class="avalon-board"></div>
                    <div class="avalon-btn">
                        <button data-action="rule" class="btn btn-md btn-green">查看规则</button>
                        <button data-action="reset" class="btn btn-md btn-green">重新开始</button>
                    </div>
                    <div class="avalon-rule hide">
                        <div>
                            <h2>角色能力</h2>
                            <h3>好人（蓝方）角色及能力：</h3>
                            <p>梅林---看到所有坏人（不含莫德雷德）</p>
                            <p>派西维尔---看到两个梅林（梅林和莫甘娜）</p>
                            <p>亚瑟的忠臣---无特殊能力好人</p>
                            <h3>坏人（红方）角色及能力：</h3>
                            <p>莫德雷德---梅林看不到他</p>
                            <p>莫甘娜---假扮梅林，迷惑派西维尔</p>
                            <p>奥伯伦---看不到其他坏人，其他坏人也看不到他</p>
                            <p>刺客---在三次任务成功后，可以刺杀梅林</p>
                            <p>莫德雷德的爪牙---无特殊能力坏人</p>           
                        </div>
                        <div>
                            <h2>游戏配置</h2>
                            <p>5人：梅林、派希维尔、忠臣 VS 莫甘娜 刺客 / 2 - 3 - 2 - 3 - 3</p>
                            <p>6人：梅林、派希维尔、忠臣X2 VS 莫甘娜 刺客 / 2 - 3 - 4 - 3 - 4</p>
                            <p>7人：梅林、派希维尔、忠臣x2 VS 莫甘娜 奥伯伦 刺客 / 2 - 3 - 3 - 4*- 4</p>
                            <p>8人：梅林、派希维尔、忠臣x3 VS 莫甘娜 爪牙 刺客 / 3 - 4 - 4 - 5*- 5</p>
                            <p>9人：梅林、派希维尔、忠臣x4 VS 莫甘娜 莫德雷德 刺客 / 3 - 4 - 4 - 5*- 5</p>
                            <p>10人：梅林、派希维尔、忠臣x4 VS 莫甘娜 莫德雷德 奥伯伦 刺客 / 3 - 4 - 4 - 5*- 5</p>
                        </div>
                        
                        <div>
                            <h2>游戏流程</h2>
                            <p>1、随机选择一个玩家担任队长</p>
                            <p>2、队长根据本轮任务需要的人数，选定任务人选。</p>
                            <p>3、从队长的右手边开始逆时针发言，队长可以选择第一个发言，或者最后一个发言，发言仅一轮。</p>
                            <p>4、所有人发言完毕后进入投票环节，所有玩家同时亮出答案（同意或反对本次任务人选），若同意人数超过玩家总数的一半，则任务执行；等于或者小于一半时任务延迟。</p>
                            <h3>任务执行：</h3>
                            <p>任务队员从任务成功和失败中选择一个秘密给出，只要出现一张（有*号的轮需要两张）失败票任务即失败，反之任务成功。队长换左手边的人担任，进入下一轮任务，继续流程2-4。</p>
                            <h3>任务延迟：</h3>
                            <p>任务不视为执行，队长换左手边的人担任，依然是本轮任务，继续流程2-4。但同一轮任务最多只能延迟4次，出现第5次延迟则本轮任务直接失败，进入下一轮任务，继续流程2-4。</p>
                        </div>
                        <div>
                            <h2>胜负判定</h2>
                            <p>游戏过程中，出现三次任务失败时坏人直接胜利。</p>
                            <p>出现三次任务成功时所有玩家禁言，刺客独自选择一个在场玩家刺杀，如被刺杀的是梅林，则坏人胜利，否则好人胜利。</p>
                        </div>
                    
                    </div>

                `,

            begin: `
                    <div class="game-begin fade-in">
                        <img src="./images/cover.jpg"/>
                        <div class="title">阿瓦隆</div>
                        
                        <div class="intro">这是一个5-10人的桌面游戏，分为红、蓝两方阵营，进行共计5轮的任务。红方需要辨认敌友、促进任务的成功以及帮助隐藏梅林。蓝方需要伪装成好人，从中作梗使任务失败，或者找出红方中的梅林刺杀。详细规则可随时在游戏过程中点击“查看规则”来打开/关闭。</div>
                        <div class="select">
                            <span class="desc">游戏人数：<span class="player"></span>人</span>
                            <span><input class="input" type="range" min="5" max="10"/></span>
                        </div>
                        <div><span class="desc">角色： </span><span class="role"></span></div>
                        <div><span class="desc">任务配置： </span><span class="vote"></span></div>
                        <div><button data-action="next" class="btn btn-md btn-red">开始游戏</button></div>
                        <div style="display: none"><button data-action="return" class="btn btn-sm btn-white">返回首页</button></div>
                    </div>
                `,
            begin_role: {
                '5':'<span class="blue-camp">梅林、派希维尔、忠臣</span> VS <span class="red-camp">莫甘娜 刺客</span>',
                '6':'<span class="blue-camp">梅林、派希维尔、忠臣X2</span> VS <span class="red-camp">莫甘娜 刺客</span>',
                '7':'<span class="blue-camp">梅林、派希维尔、忠臣x2</span> VS <span class="red-camp">莫甘娜 奥伯伦 刺客</span>',
                '8':'<span class="blue-camp">梅林、派希维尔、忠臣x3</span> VS <span class="red-camp">莫甘娜 爪牙 刺客</span>',
                '9':'<span class="blue-camp">梅林、派希维尔、忠臣x4</span> VS <span class="red-camp">莫甘娜 莫德雷德 刺客</span>',
                '10':'<span class="blue-camp">梅林、派希维尔、忠臣x4</span> VS <span class="red-camp">莫甘娜 莫德雷德 奥伯伦 刺客</span>'
            },
            assign: `
                    <div class="game-assign fade-in">
                        <div class="title">分配身份</div>
                        <div>请各玩家依次传递查看自己身份牌信息，传递前请及时把自己身份牌翻回背面，以免泄露信息</div>
                        <div><ul class="list"></ul></div>
                        <div>所有人都确认完毕自己身份后，点击“进入任务”进行下一步。</div>
                        <div><button data-action="next" class="btn btn-md btn-red">进入任务</button></div>
                    </div>
                `,
            assign_li_back: (index) => {
                return `
                    <div class="back side">
                        <div class="num">${index + 1}</div>
                    </div>
                `
            },
            assign_li_font: (index) => {
                let role = _data.role[index];
                let role_info = (role) => {
                    let info = '';
                    let check_index = (check_list) => {
                        let arr = [];
                        check_list.forEach((role) => {
                            let index = _data.role.indexOf(role) + 1;
                            if(index) {
                                arr.push(index);
                            }
                        });
                        arr.sort();
                        return arr.join('、');
                    };
                    switch (role) {
                        case 'ML':
                            info = `你知道<span class="red-camp">${check_index(['MG', 'CK', 'AB', 'ZY'])}</span>号是敌人。`;
                            break;
                        case 'PX':
                            info = `你知道<span class="blue-camp">${check_index(['ML', 'MG'])}</span>号是梅林。`;
                            break;
                        case 'ZC':
                            info = `你对其他人的身份一无所知。`;
                            break;
                        case 'MG':
                            info = `你知道<span class="red-camp">${check_index(['CK', 'ZY', 'MD'])}</span>号是你的同伙。`;
                            break;
                        case 'CK':
                            info = `你知道<span class="red-camp">${check_index(['MG', 'ZY', 'MD'])}</span>号是你的同伙。`;
                            break;
                        case 'AB':
                            info = `你对其他人的身份一无所知。`;
                            break;
                        case 'ZY':
                            info = `你知道<span class="red-camp">${check_index(['MG', 'CK', 'MD'])}</span>号是你的同伙。`;
                            break;
                        case 'MD':
                            info = `你知道<span class="red-camp">${check_index(['MG', 'CK', 'ZY'])}</span>号是你的同伙。`;
                            break;
                    }
                    return info;
                };
                return `
                    <div class="font side">
                        <img src="./images/${role}.jpg"/>
                        <div class="name ${_info.map[role].camp}-camp">${_info.map[role].name}</div>
                        <div class="info">${role_info(role)}</div>
                    </div>

                `
            },
            mission: (round) => {
                let list = () => {
                    let html = ``;
                    for(let i = 0; i < _data.vote.length; i++){
                        let div = ``;
                        if(!_data.result[i]){
                            div = `<div class="round-result pending">${i + 1}</div>`;
                        }else{
                            div = `<div class="round-result ${_data.result[i].success ? 'blue' : 'red'}">${_data.vote[i] - _data.result[i].against}<span class="ox">O</span>/${_data.result[i].against}<span class="ox">X</span></div>`
                        }
                        html += div;
                    }
                    return html;
                };
                return `
                    <div class="game-mission fade-in">
                        <div class="title">进行任务</div>
                        <div>当前是第${round + 1}${_data.role.length >=7 && round === 3 ? '*' : ''}轮，需要${_data.vote[round]}人参与</div>
                        <div class="btns">
                            <div data-action="success" class="btn btn-white vote slide-in">
                                <svg viewbox="0 0 1024 1024">
                                    <use xlink:href="#svgpath-game-O"/>
                                </svg>
                            </div>
                            <div data-action="fail" class="btn btn-white vote slide-in">
                                <svg viewbox="0 0 1024 1024">
                                    <use xlink:href="#svgpath-game-X"/>
                                </svg>
                            </div>
                        </div>
                   
                        <div class=""><span class="voted_count">0</span>/${_data.vote[round]}人已投票</div>
                        <div><button data-action="next" class="btn btn-md btn-red disabled">显示结果</button></div>
                        <div class="result-list">
                            ${list()}
                        </div>
                        <svg width="0" height="0">
                            <defs>
                                <path id="svgpath-game-O" d="M512 865.523785 512 865.523785C707.245787 865.523785 865.523785 707.245787 865.523785 512 865.523785 316.754213 707.245787 158.476215 512 158.476215 316.754191 158.476215 158.476193 316.754213 158.476193 512 158.476193 707.245787 316.754191 865.523785 512 865.523785L512 865.523785ZM512 1024 512 1024C229.230212 1024 0 794.769774 0 512 0 229.230226 229.230212 0 512 0 794.769774 0 1024 229.230226 1024 512 1024 794.769774 794.769774 1024 512 1024L512 1024Z"></path>
                                <path id="svgpath-game-X" d="M622.656 539.52l316.736-316.8c37.504-37.504 37.504-98.24 0-135.744-37.44-37.504-98.24-37.504-135.744 0l-316.8 316.8-316.736-316.8c-37.504-37.504-98.304-37.504-135.808 0-37.44 37.504-37.44 98.24 0 135.744l316.8 316.8-316.8 316.736c-37.44 37.504-37.44 98.304 0 135.808 37.504 37.504 98.304 37.504 135.808 0l316.736-316.8 316.8 316.8c37.504 37.504 98.304 37.504 135.744 0 37.504-37.504 37.504-98.304 0-135.808l-316.736-316.736z"></path>
                            </defs>
                        </svg>
                    </div>
                `
            },
            result: (result) => {
                let html = result ?
                    `   
                        <div>三次任务成功</div>
                        <div>请<span class="red-camp">刺客</span>刺杀<span class="blue-camp">梅林</span>，若刺杀成功，<span class="red-camp">红方</span>获胜；若刺杀失败，<span class="blue-camp">蓝方</span>获胜</div>
                        `
                    : `
                        <div>三次任务失败</div>
                        <div><span class="red-camp">红方</span>获胜</div>
                        `;

                return `
                    <div class="game-result fade-in">
                        <div class="title">游戏结果</div>
                        <div class="desc">
                            ${html}
                        </div>
                    </div>
                `;
            }
        };
        let fn = {
            init: (container, config = {}) => {
                _ctn = container;
                _data = {
                    vote: null,
                    role: null,
                    result: []
                };
                _ctn.innerHTML = html.init;
                _board = _ctn.querySelector('.avalon-board');
                let rule = _ctn.querySelector('.avalon-rule');
                _ctn.querySelector('[data-action="rule"]').addEventListener('click', () => {
                    rule.classList[rule.classList.contains('hide') ? 'remove' : 'add']('hide');
                });
                _ctn.querySelector('[data-action="reset"]').addEventListener('click', () => {
                    fn.init(_ctn,{player: _data.role.length});
                });
                fn.to_begin(config.player);
            },
            to_begin: (player = 5) => {
                _board.innerHTML = html.begin;
                _board.querySelector('.input').value = player;
                _board.querySelector('.input').addEventListener('change', (e) => {
                    set_player(e.target.value);
                });
                let set_player = (player) => {
                    _data.vote = _info[player].vote.slice();
                    _data.role = shuffle_arr(_info[player].role);
                    _board.querySelector('.role').innerHTML = html.begin_role[player];
                    _board.querySelector('.player').innerText = player;
                    let arr = [];
                    _data.vote.forEach((num, index) => {
                        arr.push(' ' + num + ((player >= 7 && index === 3)?'*':' '));
                    });
                    _board.querySelector('.vote').innerHTML = arr.join('-');
                };
                set_player(player);
                _board.querySelector('[data-action="next"]').addEventListener('click', () => {
                    fn.to_assign();
                });
                // _board.querySelector('[data-action="return"]').addEventListener('click', () => {
                //     list.classList.remove('hide');
                //     board.classList.add('hide');
                // });
            },
            to_assign: () => {
                _board.innerHTML = html.assign;
                let list = _board.querySelector('.list');
                _data.role.forEach((role, index) => {
                    list.innerHTML += `<li data-index="${index}">
                        ${html.assign_li_back(index)}
                        ${html.assign_li_font(index)}
                    </li>`;
                });

                list.addEventListener('click', (e) => {
                    let li = e.target;
                    while (li !== list && !li.getAttribute('data-index')){
                        li = li.parentNode;
                    }
                    let index = li.getAttribute('data-index');
                    if(index === null) return;
                    index = +index;
                    let checking = list.querySelector('.checking');
                    if(checking){
                        checking.classList.remove('checking');
                    }else{
                        li.classList.add('checking');
                    }
                });
                _board.querySelector('[data-action="next"]').addEventListener('click', () => {
                    fn.to_mission(0);
                });
            },
            to_mission: (round) => {
                _board.innerHTML = html.mission(round);
                let result = {
                    against: 0,
                    success: undefined
                };
                let voted = 0;
                ['success', 'fail'].forEach((action) => {
                    let btn = _board.querySelector(`[data-action="${action}"]`);
                    btn.addEventListener('click', () => {
                        if(voted >= _data.vote[round]) return;
                        btn.classList.add(action === 'fail' ? 'voting' : 'voting-left');

                        let animationend = () => {
                            btn.classList.remove('voting');
                            btn.classList.remove('voting-left');
                            btn.removeEventListener('animationend', animationend);
                        };
                        btn.addEventListener('animationend', animationend);
                        voted++;
                        if(action === 'fail') result.against++;
                        _board.querySelector('.voted_count').innerText = voted + '';
                        if(voted >= _data.vote[round]){
                            result.success = result.against <= (_data.role.length >= 7 && round === 3? 1 : 0);
                            _data.result.push(result);
                            _board.querySelector('[data-action="next"]').classList.remove('disabled');
                        }
                    });
                });
                _board.querySelector('[data-action="next"]').addEventListener('click', (e) => {
                    if(e.target.classList.contains('disabled')) return;
                    let [blue, red] = [0, 0];
                    _data.result.forEach((result) => {
                        if(result.success) {
                            blue ++;
                        }else {
                            red ++;
                        }
                    });
                    if(blue >= 3) {
                        fn.to_result(true);
                    }else if(red >= 3){
                        fn.to_result(false);
                    }else{
                        fn.to_mission(round + 1);
                    }
                });
            },
            to_result: (success) => {
                _board.innerHTML = html.result(success);
            }
        };
        return fn;
    };

    let games = {
        avalon: avalon,
        undercover: undercover
    };
    let board = document.querySelector('#game .game-board');
    let list = document.querySelector('#game .game-list');
    list.addEventListener('click', (e) => {
        let target = e.target;
        while(target.id !== 'game-list' && target.getAttribute && !target.getAttribute('data-game')){
            target = target.parentNode;
        }
        if(!target || !target.getAttribute) return;
        let game = target.getAttribute('data-game');
        if(!game) return;
        let util = games[game]();
        util.init(board);
        target.classList.add('enter-game');
        let animationend = () => {
            target.classList.remove('enter-game');
            list.classList.add('hide');
            board.classList.remove('hide');
            target.removeEventListener('animationend', animationend);
        };
        target.addEventListener('animationend', animationend);
    });

    let util = games['avalon']();
    util.init(board);
    list.classList.add('hide');
    board.classList.remove('hide');
})();