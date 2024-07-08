/*=====================
    Quantity Js
==========================*/
let add_quantity = document.querySelectorAll(".add-quantity");
// console.log("add_quantity", add_quantity);
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
        item.querySelector(".add-btn").style.display = "none";
        item.querySelector(".remove-minus").style.display = "flex";
        item.querySelector(".countdown-remove").style.display = "flex";
        item.querySelector(".count-increase").style.display = "flex";
    };

    item.querySelector(".remove-minus").onclick = function () {
        displayCount.value = productCounter.decrementCounter();
        var counter = productCounter.count;
        if (counter == 0) {
            item.querySelector(".remove-minus").style.display = "none";
            item.querySelector(".countdown-remove").style.display = "none";
            item.querySelector(".count-increase").style.display = "none";
            item.querySelector(".add-btn").style.display = "flex";
        }
    };

    item.querySelector(".add-btn").onclick = function () {
        displayCount.value = productCounter.incrementCounter();
        item.querySelector(".add-btn").style.display = "none";
        item.querySelector(".remove-minus").style.display = "flex";
        item.querySelector(".countdown-remove").style.display = "flex";
        item.querySelector(".count-increase").style.display = "flex";
    };
});