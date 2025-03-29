document.getElementById('apiButton').addEventListener('click', () => {
    fetch('https://api.example.com/data') // Замените URL на ваш API
        .then(response => response.json())
        .then(data => {
            document.getElementById('apiResult').innerText = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});