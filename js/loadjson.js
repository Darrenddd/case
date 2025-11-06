// 假设你的详情页文件名是 tianmai.html
const pageId = window.location.pathname.split('/').pop().replace('.html', ''); 

 // 本地测试，部署到子目录时需要修改
const Base_Path = '';

// 2. 获取 JSON 数据并设置标题
fetch(Base_Path + '/data/case_titles.json')
    .then(response => response.json())
    .then(data => {
        const caseData = data[pageId];

        if (caseData) {
            // A. 设置浏览器标签页标题 (<title> 标签)
            document.title = caseData.title_seo;

            // B. 设置页面标题 (假设你在详情页中添加了 ** id="case-title" ** )
            const h1Element = document.getElementById('case-title');
            if (h1Element) {
                h1Element.textContent = caseData.title_display;
            }

            // C. 你还可以将标题插入到 header 内部的某个位置，如果你需要的话
        }
    })
    .catch(error => console.error('Error fetching case data:', error));