const links = document.querySelectorAll('a');
for(let val of links)
  val.setAttribute('href', 'javascript:void(0)');