//@ts-nocheck
// 消息类型
const MessageType = {
    INFO: 'info', // 普通
    SUCCESS: 'success', // 成功
    ERROR: 'error', // 错误
    WARNING: 'warning' // 警告
}

// 状态icon图标
const MessageIcons = {
    INFO: 'iconfont snow-info',
    SUCCESS: 'iconfont snow-success',
    ERROR: 'iconfont snow-error',
    WARNING: 'iconfont snow-warning'
}

// 创建DOM
const createDom = ({ isId = false, name = '', tag = 'div' }) => {
    if (!tag) {
        return null
    }
    const ele = document.createElement(tag)
    if (name) {
        if (isId) {
            ele.id = name
        } else {
            ele.className = name
        }
    }
    return ele
}

// 获取类型对应的icon图标的code
const getIconClass = type => {
    let iconClass = ''
    switch (type) {
        case MessageType.SUCCESS:
            iconClass = MessageIcons.SUCCESS
            break
        case MessageType.ERROR:
            iconClass = MessageIcons.ERROR
            break
        case MessageType.WARNING:
            iconClass = MessageIcons.WARNING
            break
        default:
            iconClass = MessageIcons.INFO
            break
    }
    return iconClass
}

function _toBindEvents(domConfig, _self) {
    if (!domConfig) {
        return
    }

    const btnClick = () => {
        domConfig.destory()
    }

    const bindMouseOver = () => {
        clearTimeout(domConfig.timeout)
    }

    const bindMouseOut = () => {
        domConfig.timeout = setTimeout(() => {
            console.log(domConfig);
            domConfig.destory && domConfig.destory()
            clearTimeout(domConfig.timeout)
        }, 1000)
    }


    // 不再提示按钮的事件绑定
    if (domConfig.showClose && domConfig.closeBtn) {
        domConfig.closeBtn.addEventListener('click', btnClick)
    }

    // 鼠标移入：对销毁计时器进行销毁
    domConfig.els.addEventListener("mouseover", bindMouseOver)
    // 鼠标移出： 一秒后销毁当前message
    domConfig.els.addEventListener("mouseout", bindMouseOut)

    // 延时隐藏
    domConfig.timeout = setTimeout(() => {
        domConfig.destory()
        clearTimeout(domConfig.timeout)
    }, domConfig.duration)

    const removeEvents = () => {
        if (domConfig.showClose && domConfig.closeBtn) {
            domConfig.closeBtn.removeEventListener('click', btnClick)
        }
        domConfig.els.removeEventListener("mouseover", bindMouseOver)
        domConfig.els.removeEventListener("mouseout", bindMouseOut)
    }

    return { removeEvents }
}

class Message {
    constructor() {
        this.top = 16 // 整体的最顶部距离
        this.zIndex = 999 // 层级
        this.mainContainerIdName = 'snow-message' // 主体DOM的id名
        this.key = 1 // 用于生成唯一key
        this.messagesList = new Map() // 存储所有的message);
    }

    /**
     * 消息提示
     * @param {String} type 类型 | 必传 | 可选值：message success error warning
     * @param {String} content 内容 | 必传 | ''
     * @param {Number} duration 显示时间 | 非必传 | 默认3000毫秒
     * @param {Number} delay 出现的延时 | 非必传 | 默认0
     * @param {Boolean} showClose 是否显示 不再提示 按钮 | 非必传 | 默认false
     */
    message(config = {}) {
        const domConfig = this.createMessage(
            {
                type: config.type,
                content: config.content,
                duration: config.duration,
                delay: config.delay,
                showClose: config.showClose,
            },
        )
        document.body.appendChild(domConfig.els)

        domConfig.domEvents = _toBindEvents(domConfig, this)

        this.messagesList.set(domConfig.key, domConfig)
        return domConfig;
    }

    createMessage({ type, content, duration, delay, showClose, }) {
        const _this = this
        this.key++
        /**属性配置 */
        const config = {
            isRemove: false, // 是否被移除了
            type: type || MessageType.INFO, // 类型 message success error warning
            content: content || '', // 提示内容
            duration: duration || 3000, // 显示时间
            delay: delay || 0, // 弹出延迟
            timeout: null, // 计时器事件
            showClose: showClose || false, // 是否需要显示 不再提示 按钮
            key: this.key, // 唯一key
        }

        let top = this.top
        this.messagesList.forEach((item, key) => {
            top = top + item.els.offsetHeight + 16
        }
        )
        // #region 生成DOM、样式、关系
        const messageContainer = createDom({ name: `message-${this.key}`, tag: 'div' })
        messageContainer.className = `snow-message snow-message--${type} ${config.showClose ? "is-closable" : ""}`

        messageContainer.style = `top:${top}px;`
        messageContainer.innerHTML = `
            <i class="${getIconClass(config.type)} snow-message__icon"></i>
            <p class="snow-message__content">${config.content}</p>
        `

        if (config.showClose) {
            const messageAgainDiv = createDom({ name: 'snow-message__closeBtn', tag: 'span' })
            messageAgainDiv.innerText = 'X'
            messageContainer.appendChild(messageAgainDiv)
            config.closeBtn = messageAgainDiv
        }


        /**绑定DOM、销毁事件，以便进行控制内容与状态 */
        config.els = messageContainer
        config.destory = destory.bind(this)

        function destory(isClick) {
            if (!config.els || config.isRemove) {
                // 不存在，或已经移除，则不再继续
                return
            }
            config.els.style.top = '-20px' // 为了过渡效果
            config.els.style.opacity = '0' // 为了过渡效果
            config.isRemove = true
            const currentHeight = config.els.offsetHeight + 16
            _this.messagesList.delete(config.key);
            _this.messagesList.forEach((item, key) => {
                if (item.key <= config.key) return
                const top = parseInt(item.els.style.top, 10)
                // console.log(getComputedStyle(item.els).getPropertyValue('top'));
                item.els.style.top = `${top - currentHeight}px`
            })
            setTimeout(() => {
                config.els.remove()
                free()
            }, 400)
        }

        // 销毁重置绑定
        function free() {
            config.domEvents.removeEvents()
            config.els = null
            config.closeBtn = null
            config.destory = null
        }

        return config

    }

    INFO(config = {}) {
        return this.message({ ...config, type: MessageType.INFO })
    }

    success(config = {}) {
        return this.message({ ...config, type: MessageType.SUCCESS })
    }

    error(config = {}) {
        return this.message({ ...config, type: MessageType.ERROR })
    }

    warning(config = {}) {
        return this.message({ ...config, type: MessageType.WARNING })
    }

    beforeDestory() {

    }
}


const $message = new Message()

// console.log($message);
window["$message"] = $message