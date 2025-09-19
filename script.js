const form = document.getElementById("kakeiboForm");
const GAS_URL = "https://script.google.com/macros/s/AKfycbwuWs64YHd6umDtQ43ZZYegvoo6lHas4KIeM70UyosWQqC33yaM-gLNQY40aRDH-mms9g/exec"; // doGet/doPostのURLを入力
const LIFF_ID = "【ここにLIFF ID】";   // LINE Developers で発行されたLIFF ID

let chart;

// LIFF 初期化
liff.init({ liffId: LIFF_ID })
  .then(() => {
    console.log("LIFF initialized");
    updateChart(); // 初回グラフ描画
  })
  .catch(err => console.error("LIFF init failed", err));

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
  .then(res => res.json())
  .then(response => {
    if(response.status === "success") {
      alert("保存しました！");
      updateChart(); // 保存後にグラフ更新
      form.reset();
    } else {
      alert("保存に失敗しました: " + response.message);
    }
  });
});

// 円グラフ更新
function updateChart() {
  fetch(GAS_URL)
    .then(res => res.json())
    .then(summary => {
      const labels = Object.keys(summary);
      const values = Object.values(summary);

      if (chart) chart.destroy();

      chart = new Chart(document.getElementById("pieChart"), {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: [
              'red', 'blue', 'green', 'orange', 'purple', 'pink', 'yellow', 'cyan'
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
