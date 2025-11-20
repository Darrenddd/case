const allContainers = document.querySelectorAll('.lazy-container');

// ===============================================
// 1. 核心功能：设置占位符尺寸 (对所有容器执行)
//    - 目标：解决不同比例图片导致的页面跳动问题。
// ===============================================
function setPlaceholderSize(container) {
    const img = container.querySelector('.lazy-image');
    const width = img.getAttribute('data-width');
    const height = img.getAttribute('data-height');

    if (width && height) {
        // 计算高度占宽度的百分比： (高 / 宽) * 100
        const ratio = (parseInt(height) / parseInt(width)) * 100;
        
        // 应用到容器的 style 上，实现精准占位
        container.style.paddingBottom = `${ratio}%`;
    }
}

// ===============================================
// 2. 核心功能：触发图片加载并停止骨架屏 (按需执行)
//    - 目标：启动加载流程，并在加载完成后移除骨架屏样式。
// ===============================================
function handleImageLoading(container) {
    const img = container.querySelector('.lazy-image');
    
    // 获取真实图片源，区分首屏（src）和懒加载（data-src）
    const src = img.getAttribute('data-src') || img.src;

    const removeSkeleton = () => {
        container.classList.add('loaded'); 
        img.removeAttribute('data-src');
    };

    // 检查缓存或加载状态，防止重复加载或跳过 onload
    if (img.complete && img.src === src) {
        removeSkeleton();
        return; 
    }
    
    // 真正开始加载图片
    if (img.src !== src) {
        img.src = src;
    }

    // 监听加载事件，完成后移除骨架屏
    img.onload = removeSkeleton;
    img.onerror = removeSkeleton; 
}


// ===============================================
// 3. 初始化：设置尺寸 & 划分加载逻辑
// ===============================================

const options = {
    rootMargin: '0px 0px 500px 0px',
    threshold: 0
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const container = entry.target;
            
            // 触发加载逻辑
            handleImageLoading(container);
            
            // 停止观察
            observer.unobserve(container);
        }
    });
}, options);


allContainers.forEach(container => {
    // 【关键】：先为所有容器设置正确的占位尺寸，解决 CLS
    setPlaceholderSize(container);
    
    if (container.classList.contains('immediate-load-container')) {
        // 首屏图片：立即触发加载和骨架屏移除逻辑
        handleImageLoading(container);
    } else {
        // 后续图片：交给 Intersection Observer 观察，保持懒加载
        observer.observe(container);
    }
});