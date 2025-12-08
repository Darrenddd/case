// 左侧边栏导航菜单和右侧分类列表图片相关联
// 当点击左侧导航时，右侧滚动到相应位置
// 当滚动右侧内容里，左侧选中相应的导航菜单
document.addEventListener('DOMContentLoaded', function() {
        const navLinks = document.querySelectorAll('.sidebar .nav-link');
        // 【新增】单独选择顶部要滚动的链接
        const headerNavLink = document.querySelector('.about-container .nav-link');
        const logoLink = document.getElementById('logo-link');
        const $window = $(window);
        const $htmlBody = $('html,body');

        const setActiveLink = (elementToActivate) => {
            // console.log("setActiveLink called. Element to activate:", elementToActivate ? elementToActivate.textContent || elementToActivate.id : "null");
            navLinks.forEach(item => {
                if (item.classList.contains('active')) {
                    item.classList.remove('active');
                    // console.log("Removed active from:", item.textContent || item.id);
                }
            });
            if (logoLink && logoLink.classList.contains('active')) {
                logoLink.classList.remove('active');
                // console.log("Removed active from logo.");
            }

            if (elementToActivate) {
                elementToActivate.classList.add('active');
                // console.log("Added active to:", elementToActivate.textContent || elementToActivate.id);
            }
        };

        const sections = [];
        navLinks.forEach(link => {
            const classList = link.classList;
            let targetClass = '';
            for (let cls of classList) {
                if (cls.startsWith('scroll-')) {
                    targetClass = '.' + cls.replace('scroll-', '');
                    break;
                }
            }

            if (targetClass && $(targetClass).length) {
                const sectionElement = $(targetClass);
                sections.push({
                    linkElement: link,
                    sectionElement: sectionElement
                });
                // console.log(`Mapped: NavLink(${link.textContent}) to Section(${targetClass}) at Top: ${sectionElement.offset().top}`);
            } else {
                console.warn(`NavLink(${link.textContent}) could not find corresponding section with class: ${targetClass}`);
            }
        });

        // ===========================================
        // 1. 左侧菜单点击事件（保持不变）
        // ===========================================
        navLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                setActiveLink(this);

                const classList = this.classList;
                let targetClass = '';
                for (let cls of classList) {
                    if (cls.startsWith('scroll-')) {
                        targetClass = '.' + cls.replace('scroll-', '');
                        break;
                    }
                }

                if (targetClass && $(targetClass).length) {
                    const targetOffset = $(targetClass).offset().top;
                    // console.log(`Click: Scrolling to ${targetClass} at ${targetOffset}px`);
                    $htmlBody.stop().animate({
                        scrollTop: targetOffset
                    }, 500);
                }
            });
        });

        if (logoLink) {
            logoLink.addEventListener('click', function(event) {
                event.preventDefault();
                setActiveLink(null);
                // console.log("Click: Scrolling to top (logo).");
                $htmlBody.stop().animate({scrollTop: '0px'}, 500);
            });
        }

        if (headerNavLink) {
            headerNavLink.addEventListener('click', function(event) {
                
                // 阻止默认行为
                event.preventDefault(); 
                
                // 清除左侧所有 active 状态 (保持不变)
                setActiveLink(null); 

                const classList = this.classList;
                let targetClass = '';
                for (let cls of classList) {
                    if (cls.startsWith('scroll-')) {
                        targetClass = '.' + cls.replace('scroll-', '');
                        break;
                    }
                }

                if (targetClass && $(targetClass).length) {
                    // 【最终修复】：使用 jQuery 动画和 offset().top
                    // 这是您最初的代码逻辑，在 Edge/jQuery 环境下最可靠
                    const targetOffset = $(targetClass).offset().top;
                    
                    // 使用 $htmlBody（即 $('html,body')）来执行动画，确保兼容 Edge
                    $htmlBody.stop().animate({
                        scrollTop: targetOffset
                    }, 500); 
                }
            });
        }

        // ===========================================
        // 2. 滚动监听事件
        // ===========================================
        let scrollTimeout;
        const scrollHandler = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const currentScrollTop = $window.scrollTop();
                const offsetThreshold = 500; // 再次确认这个值是否合适

                // console.log(`Scroll: currentScrollTop = ${currentScrollTop}`);

                let currentActiveLink = null;

                for (let i = sections.length - 1; i >= 0; i--) {
                    const section = sections[i];
                    const sectionTop = section.sectionElement.offset().top;
                    // console.log(`  Checking: NavLink(${section.linkElement.textContent}), Section(${section.sectionElement.attr('class')}), Top: ${sectionTop}`);
                    if (currentScrollTop + offsetThreshold >= sectionTop) {
                        currentActiveLink = section.linkElement;
                        // console.log(`  Match found! Activating: NavLink(${currentActiveLink.textContent})`);
                        break; 
                    }
                }

                if (currentActiveLink) {
                    if (!currentActiveLink.classList.contains('active')) {
                        // console.log("Scroll: Active link changed.");
                        setActiveLink(currentActiveLink);
                    }
                } else if (currentScrollTop === 0) {
                    // console.log("Scroll: Reached top, clearing active.");
                    setActiveLink(null);
                }
            }, 100);
        };

        $window.on('scroll', scrollHandler);
        scrollHandler(); 
    });



    // ===========================================
    // 弹出式窗口来显示html
    // ===========================================

    const triggers = document.querySelectorAll('.modal-trigger');
    const dialog = document.getElementById('contentDialog');
    const iframe = document.getElementById('externalFrame');
    const closeBtn = document.getElementById('closeBtn');

    // 关键：获取 body 元素
    const body = document.body; 

    // --- 打开逻辑 ---
    triggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault(); 
            const targetSrc = this.getAttribute('data-src');
            
            iframe.src = targetSrc;
            dialog.showModal();
            
            // ⭐️ 核心修改 1: 在这里获取 pageId 并调用函数
            const targetPageId = targetSrc.split('/').pop().replace('.html', ''); 

            // 调用 load-json.js 中定义的函数
            if (typeof updateDialogTitle === 'function') {
                updateDialogTitle(targetPageId);
            }
            // ⭐️ 核心修改 1 结束

            // ⭐️ 核心修改 2: 打开时添加类，禁用滚动
            body.classList.add('modal-active');
        });
    });

    // --- 关闭逻辑 (按钮点击) ---
    closeBtn.addEventListener('click', function() {
        // 1. 添加动画类
        dialog.classList.add("closing");
        // 2. 监听动画结束事件
        dialog.addEventListener('animationend', function handler() {
            // 3. 动画播完后：移除类、执行 close、移除监听
            dialog.classList.remove("closing");
            dialog.close();
            dialog.removeEventListener('animationend', handler);
        }, { once: true });
        // dialog.close();
        // 恢复滚动和清理 iframe 的操作放到 'close' 事件监听器中统一处理
    });

    // ----------------------------------------------------
    // ⭐️ 核心修正：针对 Firefox 优化，检查点击位置是否在弹窗外
    // ----------------------------------------------------
    dialog.addEventListener('click', function(event) {
        const dialogDimensions = dialog.getBoundingClientRect();
        
        // 检查点击的 X 坐标和 Y 坐标是否在弹窗的可见边界之外
        if (
            event.clientX < dialogDimensions.left ||
            event.clientX > dialogDimensions.right ||
            event.clientY < dialogDimensions.top ||
            event.clientY > dialogDimensions.bottom
        ) {
            // 1. 添加动画类
            dialog.classList.add("closing");
            // 2. 监听动画结束事件
            dialog.addEventListener('animationend', function handler() {
                // 3. 动画播完后：移除类、执行 close、移除监听
                dialog.classList.remove("closing");
                dialog.close();
                dialog.removeEventListener('animationend', handler);
            }, { once: true });
        }
    });

    // ----------------------------------------------------
    // 统一处理所有关闭操作（按钮、Esc 键、遮罩层点击）
    // ----------------------------------------------------
    dialog.addEventListener('close', function() {
        // 恢复滚动
        body.classList.remove('modal-active');
        // 清空 iframe，释放内存
        iframe.src = 'about:blank'; 
    });