# app.py CORRIGIDO

# Imports necessários, incluindo flash e current_user
from flask import Flask, render_template, redirect, url_for, request, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin, LoginManager, login_user, login_required, logout_user, current_user
from flask_bcrypt import Bcrypt

# --- Configuração Inicial ---
app = Flask(__name__)
app.config['SECRET_KEY'] = 'sua_chave_secreta_aqui'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# --- Gerenciamento de Login ---
login_manager = LoginManager()
login_manager.init_app(app)
# CORREÇÃO: Define a view de login para redirecionamento
login_manager.login_view = 'login' 
login_manager.login_message = 'Por favor, faça login para acessar esta página.'
login_manager.login_message_category = 'info'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# --- Modelo do Banco de Dados ---
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)

# --- Rotas da Aplicação ---
@app.route('/')
def home():
    # MELHORIA: Se o usuário já estiver logado, vai para o dashboard
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user = User.query.filter_by(username=request.form['username']).first()
        if user and bcrypt.check_password_hash(user.password, request.form['password']):
            login_user(user)
            return redirect(url_for('dashboard'))
        else:
            # CORREÇÃO: Usando flash corretamente
            flash('Login falhou. Verifique seu usuário e senha.', 'danger')
            return redirect(url_for('login'))
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        # CORREÇÃO: Verifica se o usuário já existe
        existing_user = User.query.filter_by(username=request.form['username']).first()
        if existing_user:
            flash('Este nome de usuário já existe. Por favor, escolha outro.', 'warning')
            return redirect(url_for('register'))

        hashed_password = bcrypt.generate_password_hash(request.form['password']).decode('utf-8')
        new_user = User(username=request.form['username'], password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        # CORREÇÃO: Usando flash corretamente
        flash('Registro bem-sucedido. Agora você pode fazer login.', 'success')
        return redirect(url_for('login'))
    return render_template('register.html')

# CORREÇÃO: Rota /dashboard separada e correta
@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html')

# CORREÇÃO: Rota /logout separada e correta
@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

# --- Execução do App ---
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)