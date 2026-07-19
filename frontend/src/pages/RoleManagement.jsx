export default function RoleManagement() {
    return (
        <div className="page">
            <h1>Role Management</h1>

            <form>
                <label>Username</label>
                <input type="text" />

                <label>Role</label>
                <select>
                    <option>Admin</option>
                    <option>Manager</option>
                    <option>Employee</option>
                </select>

                <button>Update Role</button>
            </form>

            <h2>Users</h2>
            <table>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    );
}
