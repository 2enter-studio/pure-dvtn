const slider_ammount = 2;

for (let i = 1; i <= slider_ammount; i++) {
    const slider = document.getElementById(`slider_${i}`);
    slider.oninput = () => {
        fetch('/ws/dvtn/slider', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                slider_1: document.getElementById('slider_1').value,
                slider_2: document.getElementById('slider_2').value
            })
        }).then(() => {
            const slider_value = document.getElementById(`slider_${i}_value`);
            slider_value.innerHTML = slider.value;
        })
    }
}
