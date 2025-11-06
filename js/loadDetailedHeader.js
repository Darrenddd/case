fetch('/DetailedHeader.html') 
  .then(response => response.text())
  .then(data => {
    // 假设你要插入内容到 <header> 标签中
    document.querySelector('header').innerHTML = data; 
  });