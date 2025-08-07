# app.py (API 제공 최종본)

from flask import Flask, jsonify, render_template
import json
import os

app = Flask(__name__)

# --- 데이터 로드 함수 ---
def load_local_data():
    # Flask의 app.root_path를 사용하여 어떤 환경에서든 절대 경로를 기준으로 파일을 찾습니다.
    file_path = os.path.join(app.root_path, 'static', 'my_data.json')
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"❌ '{file_path}' 파일을 찾을 수 없습니다. 파일이 해당 위치에 있는지 확인해주세요.")
        return []

# --- API 라우트 ---
@app.route('/')
def index():
    """메인 페이지(index.html)를 보여주는 함수"""
    return render_template('index.html')

@app.route('/api/data')
def get_all_data():
    """로컬 JSON 파일의 모든 데이터를 반환합니다."""
    return jsonify(load_local_data())

# 로컬 테스트를 위한 서버 실행 부분
if __name__ == '__main__':
    app.run(debug=True, port=5001)
