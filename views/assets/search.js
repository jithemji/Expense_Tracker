let searchText = document.getElementById('searchId');

searchText.addEventListener("input", function() {
    let searchCard = document.getElementsByClassName('searchCard');

    let inputText = searchText.value.toLowerCase();

    Array.from(searchCard).forEach(function(element) {
        let cardText = element.getElementsByTagName("h3")[0].innerText.toLocaleLowerCase();
        if (cardText.includes(inputText)) {
            element.style.display = "block";
        } else {
            element.style.display = "none";
        }
    })
});