const prototypes = {
    proxyElement: (name, ip, port, link, status, i) => {
    const isOnline = status == 1;

    const statusClass = isOnline
        ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.45)]'
        : 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.35)]';

    const statusText = isOnline ? 'online' : 'unstable';

    return `
    <div class="proxy group flex items-start flex-col cursor-pointer w-full p-[10px] rounded-2xl mb-1.5
                bg-white/[0.035] hover:bg-white/[0.055]
                border border-white/8 hover:border-sky-400/25
                shadow-[0_10px_28px_rgba(0,0,0,0.18)]
                transition-all duration-300 backdrop-blur-xl">

        <label class="flex items-center cursor-pointer w-full rounded-xl p-0.5">
            <input type="radio" name="option" value="${i}" id="option${i}" class="sr-only peer">

            <span class="relative w-3.5 h-3.5 rounded-full mr-2.5 shrink-0
                         border border-slate-500/70
                         bg-slate-950/60
                         peer-checked:border-sky-400
                         peer-checked:bg-sky-400
                         peer-checked:shadow-[0_0_16px_rgba(56,189,248,0.55)]
                         transition-all duration-200">
                <span class="absolute inset-[4px] rounded-full bg-slate-950 opacity-0 peer-checked:opacity-100"></span>
            </span>

            <span class="text-[14px] font-medium tracking-[-0.01em] text-slate-200 group-hover:text-slate-100 transition-colors">
                ${name}
            </span>

            <span class="status w-2.5 h-2.5 ${statusClass} border border-white/15 rounded-full ml-2"
                  title="${statusText}"></span>
        </label>

        <div class="m-0 mt-1.5 p-0 flex justify-start items-center flex-row gap-1.5 w-full">
            <span class="self-baseline text-xs text-slate-400 bg-white/[0.03] border border-white/6
                         px-2 py-0.5 rounded-lg">
                ip: <span class="text-slate-300">${ip}</span>
            </span>

            <span class="self-baseline text-xs text-slate-400 bg-white/[0.03] border border-white/6
                         px-2 py-0.5 rounded-lg">
                port: <span class="text-slate-300">${port}</span>
            </span>

            <button type="button" id="copyLinkBtn-${i}"
                class="copyLink ml-auto cursor-pointer
                       bg-white/[0.04] hover:bg-white/[0.07] active:bg-white/[0.1]
                       text-slate-400 hover:text-sky-200
                       p-1 w-7 h-7 rounded-lg transition-all duration-200
                       flex items-center justify-center
                       border border-white/8 hover:border-sky-400/30
                       shadow-[0_8px_18px_rgba(0,0,0,0.16)]"
                title="Скопировать ссылку">

                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"
                     fill="currentColor" class="size-4">
                    <path fill-rule="evenodd" d="M8.914 6.025a.75.75 0 0 1 1.06 0 3.5 3.5 0 0 1 0 4.95l-2 2a3.5 3.5 0 0 1-5.396-4.402.75.75 0 0 1 1.251.827 2 2 0 0 0 3.085 2.514l2-2a2 2 0 0 0 0-2.828.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                    <path fill-rule="evenodd" d="M7.086 9.975a.75.75 0 0 1-1.06 0 3.5 3.5 0 0 1 0-4.95l2-2a3.5 3.5 0 0 1 5.396 4.402.75.75 0 0 1-1.251-.827 2 2 0 0 0-3.085-2.514l-2 2a2 2 0 0 0 0 2.828.75.75 0 0 1 0 1.06Z" clip-rule="evenodd" />
                </svg>
            </button>
        </div>
    </div>`;
},

    updButton: () => {
        return `
        <button type="button" id="updBtn"
            class="updateBtn self-end cursor-pointer
                   bg-white/[0.07] hover:bg-sky-400/15 active:bg-sky-400/25
                   text-slate-200 hover:text-sky-200
                   w-9 h-9 flex items-center justify-center rounded-xl
                   transition-all duration-200
                   border border-white/10 hover:border-sky-400/35
                   shadow-[0_10px_24px_rgba(0,0,0,0.22)]">
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                <path fill-rule="evenodd" d="M13.836 2.477a.75.75 0 0 1 .75.75v3.182a.75.75 0 0 1-.75.75h-3.182a.75.75 0 0 1 0-1.5h1.37l-.84-.841a4.5 4.5 0 0 0-7.08.932.75.75 0 0 1-1.3-.75 6 6 0 0 1 9.44-1.242l.842.84V3.227a.75.75 0 0 1 .75-.75Zm-.911 7.5A.75.75 0 0 1 13.199 11a6 6 0 0 1-9.44 1.241l-.84-.84v1.371a.75.75 0 0 1-1.5 0V9.591a.75.75 0 0 1 .75-.75H5.35a.75.75 0 0 1 0 1.5H3.98l.841.841a4.5 4.5 0 0 0 7.08-.932.75.75 0 0 1 1.025-.273Z" clip-rule="evenodd" />
            </svg>
        </button>`;
    }
};

const injects = {
    proxyList: () => {
        return document.getElementById('proxyList');
    },
    proxySpinner: () => {
        return document.getElementById('spinnerProxy');
    },
    copyLinkBtns: () => {
        return document.getElementsByClassName('copyLink')
    },
    copyLinkBtn: (n) => {
        return document.getElementById(`copyLinkBtn-${n}`)
    },
    connectBtn: () => {
        return document.getElementById('connectBtn')
    }
}

let proxies = [];

async function getCats() {
    let r;
    r = await f('./cats.json');
    return r;
}

function showNotification(text, description = '', type = 'info', duration = 3000) {
    const notification = document.getElementById('notification');
    const content = document.getElementById('notificationContent');
    const textEl = document.getElementById('notificationText');
    const descEl = document.getElementById('notificationDescription');

    content.className = `
        p-4 rounded-2xl shadow-[0_24px_70px_rgba(0,0,0,0.42)]
        border border-white/10 border-l-4
        backdrop-blur-xl
    `;

    textEl.textContent = text;
    descEl.textContent = description;

    const colorClasses = {
        success: 'bg-emerald-950/85 text-emerald-100 border-l-emerald-400',
        warning: 'bg-amber-950/85 text-amber-100 border-l-amber-400',
        error: 'bg-red-950/85 text-red-100 border-l-red-400',
        info: 'bg-sky-950/85 text-sky-100 border-l-sky-400'
    };

    content.classList.add(...(colorClasses[type] || colorClasses.info).split(' '));

    notification.classList.remove('hidden');
    notification.classList.add('animate-fadeIn');

    const hideNotification = () => {
        notification.classList.remove('animate-fadeIn');
        notification.classList.add('animate-fadeOut');

        setTimeout(() => {
            notification.classList.add('hidden');
            notification.classList.remove('animate-fadeOut');
        }, 300);
    };

    setTimeout(hideNotification, duration);
}

async function loadCats() {
    proxies = await getCats();
    let j = 0;
    if (proxies) {
        injects.proxySpinner().setAttribute('style', 'display: none;');
        proxies.map((el) => {
            j++;
            let url = el.url;
            url = url.split('&')
            url[0] = url[0].replace('tg://proxy?server=', '');
            url[1] = url[1].replace('port=', '');
            url[2] = url[2].replace('secret=', '');
            url.push(el.url);
            console.log(url)

            injects.proxyList().innerHTML += prototypes.proxyElement(el.name, url[0], url[1], url[3], el.status == 'online' ? 1 : 0, j)
        })
    }
    injects.proxyList().innerHTML += `<div class="shadow-bottom"></div>`
    let btnsCopy = injects.copyLinkBtns();

    for (let i = 0; i < injects.copyLinkBtns().length; i++) {
        injects.copyLinkBtn(i + 1).onclick = function () {
            let w = proxies[i].url;
            navigator.clipboard.writeText(w);
            showNotification('Успешно скопировано!');
            console.log(w);
        }
    }

}

async function ping(){
    let p = await f('https://mtpro.xyz/api/?type=mtproto');
    console.log(p);
}

$(window).on('load', async function () {

    loadCats()

    injects.connectBtn().addEventListener('click', () => {
        const selected = document.querySelector('input[name="option"]:checked');
        if (!selected) {
            showNotification('Прокси не выбран', 'Сначала выберите сервер из списка.', 'warning');
            return;
        }
        const value = parseInt(selected.value, 10);
        const proxyUrl = proxies[value - 1].url;
        console.log(proxyUrl)
        try {
            window.open(proxyUrl, '_blank');
        } catch (error) {
            console.error('Ошибка при открытии прокси:', error);
            showNotification('Не удалось открыть прокси', 'Попробуйте выбрать другой сервер.', 'error');
        }
    });

});