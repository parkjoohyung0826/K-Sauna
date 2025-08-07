# app.py (최종 완성본)

from flask import Flask, render_template, json
import os

app = Flask(__name__)

def load_local_data():
    # 어떤 환경에서든 static/my_data.json 파일의 절대 경로를 찾습니다.
    file_path = os.path.join(app.root_path, 'static', 'my_data.json')
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"❌ '{file_path}' 파일을 찾을 수 없습니다.")
        return []

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    """
    index.html 페이지를 렌더링하면서,
    찜질방 데이터 전체를 페이지 안에 직접 주입합니다.
    """
    sauna_data = load_local_data()
    return render_template('index.html', sauna_data=sauna_data)

if __name__ == '__main__':
    app.run(debug=True, port=5001)