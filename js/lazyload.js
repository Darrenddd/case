const lazyImages = document.querySelectorAll('.lazy');

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        // 检查元素是否进入视口
        if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute('data-src');

            // 1. 设置真实的图片地址，开始加载
            if (src) {
                img.src = src;
                // 2. 移除 data-src 属性
                img.removeAttribute('data-src');
                // 3. 停止观察该元素（因为它已经加载了）
                observer.unobserve(img);
            }
        }
    });
});

// 遍历所有需要懒加载的图片，开始观察
lazyImages.forEach(img => {
    observer.observe(img);
});