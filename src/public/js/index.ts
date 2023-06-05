// import 'dotenv/config'
// const local_url_base = `http://${process.env.LOCAL_IP_ADDR}:${process.env.PORT}`;


const slider_amount = 2;

const name_input = document.getElementById('name') as HTMLInputElement;
const birthday_input = document.getElementById('birthday') as HTMLInputElement;
birthday_input.max = new Date().toISOString().split("T")[0];


for (let i = 1; i <= slider_amount; i++) {
    const slider = document.getElementById(`slider_${i}`) as HTMLInputElement;
    slider.oninput = () => {
        fetch(`${local_url_base}/ws/dvtn/slider`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                slider_1: parseInt((document.getElementById('slider_1') as HTMLInputElement).value),
                slider_2: parseInt((document.getElementById('slider_2') as HTMLInputElement).value),
            }),
            mode: 'no-cors'

        }).then(() => {
            const slider_value = document.getElementById(`slider_${i}_value`) as HTMLSpanElement;
            slider_value.innerHTML = slider.value;
        })
    }
}

name_input.oninput = () => {
    const input_value = name_input.value;
    const max_out_value = 55550;
    const char_range = 65535;
    let out_value = 0;
    for (const char of input_value) {
        out_value += char.charCodeAt(0);
    }
    out_value /= input_value.length || 1;
    out_value *= max_out_value / char_range;
    console.log(out_value)

    fetch(`${local_url_base}/ws/dvtn/name`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: out_value
        }),
        mode: 'no-cors'
    })
}

birthday_input.oninput = () => {
    const input_values = birthday_input.value.split('-');
    const max_num = 360;
    const max_year = new Date().getFullYear();

    const num_1 = parseInt(input_values[0]) * max_num / max_year;
    const num_2 = parseInt(input_values[1]) * max_num / 12;
    const num_3 = parseInt(input_values[2]) * max_num / 31;

    const out_value = `P=${num_1.toFixed(2)} Y=${num_2.toFixed(2)} R=${num_3.toFixed(2)}`
    console.log(out_value)

    fetch(`${local_url_base}/ws/dvtn/birthday`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            birthday: out_value
        }),
        mode: 'no-cors'

    })
}