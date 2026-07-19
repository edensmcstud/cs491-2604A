export default function Login() {
    return (
        <div className="page">
            <h1>Login</h1>
            <form>
                <label>Username</label>
                <input type="text" />

                <label>Password</label>
                <input type="password" />

                <button>Login</button>
            </form>
        </div>
    );
}
