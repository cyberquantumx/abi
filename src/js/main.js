const prototypes = {
    proxyElement: (name, ip, port, link, status, i) => {
        return `<div class="proxy flex items-left flex-col cursor-pointer w-full p-2 bg-white rounded-xl border border-gray-100 mb-1">
        <label class="flex items-center cursor-pointer group bg-white p-2 pt-0 pl-1 rounded-xl">
            <input type="radio" name="option" value="${i}" id="option${i}" class="sr-only peer transition-all">
            <span
                class="w-4 h-4 border-2 border-black rounded-full mr-2 peer-checked:bg-black peer-checked:border-transparent"></span>
            <span>${name}</span>
            <span class="status w-3 h-3 bg-${status == 1 ? 'lime' : 'yellow'}-400 border border-gray-200 rounded-full ml-2"></span>
            </span>

        </label>
        <div class="mg-0 p-0 flex justify-baseline align-baseline items-baseline flex-row">
            <span
                class="self-baseline text-xs text-gray-500 border p-1 pl-2 pr-2 rounded border-gray-100 mr-2">ip:
                ${ip}</span>
            <span
                class="self-baseline text-xs text-gray-500 border p-1 pl-2 pr-2 rounded border-gray-100 mr-2">port:
                ${port}</span>
                <button type="button" id="copyLinkBtn-${i}"
                class="copyLink self-end bg-none cursor-pointer active:bg-neutral-200 hover:bg-neutral-100 text-black p-1 w-6.5 h-6.5 rounded-md transition-colors flex items-center border border-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="gray" class="size-4">
                    <path fill-rule="evenodd" d="M8.914 6.025a.75.75 0 0 1 1.06 0 3.5 3.5 0 0 1 0 4.95l-2 2a3.5 3.5 0 0 1-5.396-4.402.75.75 0 0 1 1.251.827 2 2 0 0 0 3.085 2.514l2-2a2 2 0 0 0 0-2.828.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                    <path fill-rule="evenodd" d="M7.086 9.975a.75.75 0 0 1-1.06 0 3.5 3.5 0 0 1 0-4.95l2-2a3.5 3.5 0 0 1 5.396 4.402.75.75 0 0 1-1.251-.827 2 2 0 0 0-3.085-2.514l-2 2a2 2 0 0 0 0 2.828.75.75 0 0 1 0 1.06Z" clip-rule="evenodd" />
                  </svg>
                  
            </button>
        </div>
    </div>`
    },
    updButton: () => {
        return `<button type="button" id="updBtn"
        class="updateBtn self-end bg-neutral-900 cursor-pointer active:bg-neutral-600 hover:bg-black text-white w-8 h-8 flex justify-center rounded-md transition-colors">
        <svg class="w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
            <path fill-rule="evenodd" d="M13.836 2.477a.75.75 0 0 1 .75.75v3.182a.75.75 0 0 1-.75.75h-3.182a.75.75 0 0 1 0-1.5h1.37l-.84-.841a4.5 4.5 0 0 0-7.08.932.75.75 0 0 1-1.3-.75 6 6 0 0 1 9.44-1.242l.842.84V3.227a.75.75 0 0 1 .75-.75Zm-.911 7.5A.75.75 0 0 1 13.199 11a6 6 0 0 1-9.44 1.241l-.84-.84v1.371a.75.75 0 0 1-1.5 0V9.591a.75.75 0 0 1 .75-.75H5.35a.75.75 0 0 1 0 1.5H3.98l.841.841a4.5 4.5 0 0 0 7.08-.932.75.75 0 0 1 1.025-.273Z" clip-rule="evenodd" />
          </svg>                      
    </button>`
    }
}

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

    content.className = 'p-4 rounded-lg shadow-lg border-l-4';

    textEl.textContent = text;
    descEl.textContent = description;


    const colorClasses = {
        success: 'bg-green-50 text-green-800 border-green-500',
        warning: 'bg-yellow-50 text-yellow-800 border-yellow-500',
        error: 'bg-red-50 text-red-800 border-red-500',
        info: 'bg-blue-50 text-blue-800 border-blue-500'
    };

    content.classList.add(...colorClasses[type].split(' '));

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

    let timeoutId = setTimeout(hideNotification, duration);

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
            alert('Пожалуйста, выберите прокси‑сервер');
            return;
        }
        const value = parseInt(selected.value, 10);
        const proxyUrl = proxies[value - 1].url;
        console.log(proxyUrl)
        try {
            window.open(proxyUrl, '_blank');
        } catch (error) {
            console.error('Ошибка при открытии прокси:', error);
            alert('Не удалось подключиться к выбранному прокси-серверу');
        }
    });

});