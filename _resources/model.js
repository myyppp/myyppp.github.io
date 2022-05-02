// 看板娘
L2Dwidget.init({
    "model": {
        jsonPath: "https://unpkg.com/live2d-widget-model-koharu@1.0.5/assets/koharu.model.json", // 小萝莉模型
        "scale": 1
    },
    "display": {
        "position": "right", // 看板娘的表现位置
        "width": 50,  // 小萝莉的宽度
        "height": 100, // 小萝莉的高度
        "hOffset": -5,
        "vOffset": 26
    },
    "mobile": {
        "show": true,
        "scale": 0.5
    },
    "react": {
        "opacityDefault": 0.7,
        "opacityOnHover": 0.2
    }
});