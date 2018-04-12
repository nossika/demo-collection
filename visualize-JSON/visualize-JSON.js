function visualizeJSON (json, containerEl) {
    containerEl.innerHTML = '';
    function getTreeNode (json) {
        function getType (value) {
            const type = typeof value;
            if (type === 'object') {
                if (value === null) {
                    return 'null';
                } else if (value instanceof Array) {
                    return 'array';
                }
            }
            return type;
        }
        function rowHTML (value, path = []) {
            let html = ``;
            const type = getType(value);
            const dataPath = path.join('-');
            switch (type) {
                case 'null':
                case 'undefined':
                    html = `<span class="color-null">${value}</span>`;
                    break;
                case 'number':
                    html = `<span class="color-number">${value}</span>`;
                    break;
                case 'string':
                    html = `<span class="color-string">"${value}"</span>`;
                    break;
                case 'array':
                    html += `<span class="quote-begin ${value.length ? '' : 'empty'}" data-path="${dataPath}">[</span>`;
                    if (value.length) {
                        html += `<br/><span class="quote-content">`;
                        html += value
                            .map((subValue, index) => rowHTML(subValue, path.concat(index)))
                            .join(`<span class="comma">,</span><br/>`);
                        html += '</span><br/>';
                    }
                    html += `<span class="quote-end ${value.length ? '' : 'empty'}" data-path="${dataPath}">]</span>`;
                    break;
                case 'object':
                    const objectProps = Object.keys(value);
                    html += `<span class="quote-begin ${objectProps.length ? '' : 'empty'}" data-path="${dataPath}">{</span>`;
                    if (objectProps.length) {
                        html += `<br/><span data-content class="quote-content">`;
                        let arr = [];
                        objectProps.forEach(prop => {
                            const dataSubPath = path.concat(prop).join('-');
                            arr.push(`<span data-path="${dataSubPath}" class="prop"><span data-path="${dataSubPath}" class="color-prop">"${prop}"</span>: </span>` + rowHTML(value[prop], path.concat(prop)));
                        });
                        html += arr.join(`<span class="comma">,</span><br/>`);
                        html += '</span><br/>';
                    }
                    html += `<span class="quote-end ${objectProps.length ? '' : 'empty'}" data-path="${dataPath}">}</span>`;
                    break;
            }
            html = `<span data-visibility="${dataPath}">${html}</span>`;
            return html;
        }

        const eWrapper = document.createElement('div');
        eWrapper.innerHTML = rowHTML(json);
        eWrapper.addEventListener('click', e => {
            let ePath = e.target;
            const path = ePath.dataset.path;
            const eProp = eWrapper.querySelector(`[data-visibility="${path}"]`);
            if (!eProp) return;
            eProp.classList.toggle('hidden');
        });
        eWrapper.classList.add('json-format');
        return eWrapper;
    }
    containerEl.appendChild(getTreeNode(json));
}