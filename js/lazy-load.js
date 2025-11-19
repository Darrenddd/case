const allContainers = document.querySelectorAll('.lazy-container');

// 定义加载和停止骨架屏的通用逻辑
function handleImageLoading(container) {
    // 确保能够正确找到容器内的图片
    const img = container.querySelector('.lazy-image');
    
    // 获取真实图片源，区分首屏（src）和懒加载（data-src）
    const src = img.getAttribute('data-src') || img.src;

    // 1. 定义加载完成后执行的操作：移除骨架屏样式
    const removeSkeleton = () => {
        // 【关键】：将 loaded 类添加到容器上
        container.classList.add('loaded'); 
        img.removeAttribute('data-src');
    };

    // 2. 检查图片是否已经加载完成（处理缓存情况）
    // 即使图片已在缓存中，也立即停止动画
    if (img.complete && img.src === src) {
        removeSkeleton();
        return; 
    }
    
    // 3. 开始加载图片 (如果 img.src 不是真实图片源，则赋值)
    if (img.src !== src) {
        img.src = src;
    }

    // 4. 监听图片加载完成事件
    img.onload = removeSkeleton;
    img.onerror = removeSkeleton; 
}

// ===============================================
// 1. 初始化：区分首屏立即加载和滚动加载
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
    if (container.classList.contains('immediate-load-container')) {
        // 首屏图片：立即触发加载和骨架屏移除逻辑
        handleImageLoading(container);
    } else {
        // 后续图片：交给 Intersection Observer 观察
        observer.observe(container);
    }
});