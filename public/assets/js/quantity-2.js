/*=====================
    Quantity 2 Js
==========================*/
let add_quantity = document.querySelectorAll(".quantity-box");

add_quantity.forEach((item) => {
    var productCounter = {
        count: 0,
        incrementCounter: function () {
            if (this.count < 10) {
                return (this.count = this.count + 1);
            } else {
                console.log("limit 10");
                return this.count;
            }
        },
        decrementCounter: function () {
            if (this.count > 0) {
                return (this.count = this.count - 1);
            } else {
                return (this.count = 0);
            }
        },
    };
    var displayCount = item.querySelector(".countdown-remove");

    item.querySelector(".count-increase").onclick = function () {
        displayCount.value = productCounter.incrementCounter();
    };

    item.querySelector(".remove-minus").onclick = function () {
        displayCount.value = productCounter.decrementCounter();
    };

});