// Listen for form submission
document.getElementById("price-form").addEventListener("submit", submitHandler);

function submitHandler(event) {
    event.preventDefault(); // Prevent default form submit
    const form = event.target;
    const ticker = form.ticker.value.trim();
    const numDays = parseInt(form.numdays.value, 10) || 1;

    getLivePrice(ticker, numDays)
        .then(createTable)
        .catch(err => {
            console.error(err);
            document.querySelector('#price-div').innerHTML = `<div class="alert alert-danger">Failed to load data.</div>`;
        });
}

async function getLivePrice(ticker, numDays) {
    // Generate fake data for the past `numDays` days
    const price_data = [];
    const today = new Date();

    for (let i = numDays - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];

        // Fake a close price between 100 and 500
        const price = (100 + Math.random() * 400).toFixed(2);
        price_data.push([ dateStr, price ]);
    }

    // Return a Promise that resolves to the same shape as the real API
    return Promise.resolve({
        ticker: ticker.toUpperCase(),
        price_data: price_data
    });
}

function createTable(priceData) {
    console.log("Fake price data:", priceData);

    let htmlString = `
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Date</th>
            <th>Ticker</th>
            <th>Close Price</th>
          </tr>
        </thead>
        <tbody>
    `;

    priceData.price_data.forEach(entry => {
        htmlString += `
          <tr>
            <td>${entry[0]}</td>
            <td>${priceData.ticker}</td>
            <td>${entry[1]}</td>
          </tr>
        `;
    });

    htmlString += `
        </tbody>
      </table>
    `;

    document.querySelector('#price-div').innerHTML = htmlString;
}
