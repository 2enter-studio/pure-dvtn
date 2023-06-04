const slider_amount = 2;

for (let i = 1; i <= slider_amount; i++) {
    const slider = document.getElementById(`slider_${i}`);
    slider.oninput = () => {
        fetch('/ws/dvtn/slider', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                slider_1: parseInt(document.getElementById('slider_1').value),
                slider_2: parseInt(document.getElementById('slider_2').value)
            })
        }).then(() => {
            const slider_value = document.getElementById(`slider_${i}_value`);
            slider_value.innerHTML = slider.value;
        })
    }
}
