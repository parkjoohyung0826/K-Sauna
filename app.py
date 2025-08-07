# app.py (최종 단순화 버전)

from flask import Flask, render_template

app = Flask(__name__)

# [수정됨] 이제 이 서버는 어떤 요청이 오든
# 자바스크립트가 작동할 뼈대인 index.html만 보여주면 됩니다.
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    """
    Serves the index.html for any path.
    This allows the frontend to handle everything.
    """
    return render_template('index.html')

# /api/data 엔드포인트는 더 이상 필요 없습니다.
# 로컬 테스트를 위한 실행 부분만 남겨둡니다.
if __name__ == '__main__':
    app.run(debug=True, port=5001)
