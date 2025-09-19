const form = document.getElementById("kakeiboForm");
const GAS_URL = "https://script.google.com/macros/s/AKfycbwuWs64YHd6umDtQ43ZZYegvoo6lHas4KIeM70UyosWQqC33yaM-gLNQY40aRDH-mms9g/exec"; // ここに doGet/doPost の URL を入力

// フォーム送信
form.addEventListener("submit", function(e) {
  e.preventDefault();

  const data = {
    date: document.getElementById("date").value,
    item: document.getElementById("item").value,
    amount: parseFloat(document.getElementById("amount").value),
    type: document.getElementById("type").value
  };

  fetch(GAS_URL, {
    method: "POST",
    body: JSON.stringify(data)
  })
  .then(res => res.text())
  .then(() => {
    alert("保存しました！");
    updateChart(); // 保存後にグラフ更新
    form.reset();
  });
});

// 円グラフ描画
let chart;

function updateChart() {
  fetch(GAS_URL)
    .then(res => res.json())
    .then(summary => {
      const labels = Object.keys(summary);
      const values = Object.values(summary);

      if (chart) {
        chart.destroy();
      }

      chart = new Chart(document.getElementById("pieChart"), {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: [
              'red', 'blue', 'green', 'orange', 'purple', 'pink'
            ]
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: '支出割合（円グラフ）' }
          }
        }
      });
    });
}

// ページ読み込み時にグラフ更新
updateChart();
