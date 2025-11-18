const lazyImages = document.querySelectorAll('.lazy');

// 定義 Intersection Observer 的選項
const options = {
    // rootMargin 的格式：'上 右 下 左'，值必須是 px 或 %。
    // '0px 0px 300px 0px' 表示將底部偵測範圍擴大 300 像素。
    // 這樣圖片在距離視口底部 300px 遠時就會觸發加載。
    rootMargin: '0px 0px 2000px 0px',
    threshold: 0 // 只要有一點點進入擴展區域就觸發
};

// 將 options 傳入構造函數
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute('data-src');

            if (src) {
                img.src = src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        }
    });
}, options); // <--- 傳入 options

// 遍历所有需要懒加载的图片，开始观察
lazyImages.forEach(img => {
    observer.observe(img);
});