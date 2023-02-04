(function () {
    function fnAddButtons() {
        var btn = document.createElement("input");
        btn.value = "Add";
        btn.id = "search-mm-btn";
        btn.type = "submit";
        document.querySelector(".akczyd").appendChild(btn);
      }
      function fnDefineEvents() {
        document
          .getElementById("search-mm-btn")
          .addEventListener("click", function (event) {
              let  textArea=document.querySelector(".er8xn");
            fnSearch(textArea);
          });
      }
      function fnSearch(str) {
      
        alert(str.value)
      }
    
      fnAddButtons();
      fnDefineEvents();
   
})();