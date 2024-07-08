/*=====================
    Active Section js
==========================*/
var listItems = document.querySelectorAll('.selectionUI li');

listItems.forEach(function (item) {
    item.addEventListener('click', function () {
        listItems.forEach(function (sibling) {
            sibling.classList.remove('active');
        });

        this.classList.add('active');
    });
});