/* var registeredUsers = [
    // aemail: 'adil@gmail.com', passwordHash : azerty
    { email: 'adil@gmail.com', passwordHash: '$2a$10$8jSEllXE3jB40s694ItpHe4aM1lpucqwy8xIAXIFNXGBYn3ZLhtMe' },
    { email: 'sabir@gmail.com', passwordHash: '$2a$10$8jSEllXE3jB40s694ItpHe4aM1lpucqwy8xIAXIFNXGBYn3ZLhtMe' },


];
function getRegisteredUsers() {
    return registeredUsers;
}

function newUserRegistered(newUser) {
    registeredUsers.push(newUser)

} */


function newUserRegisteredBD(newUser, client, callback) {
    const query = {
        text: 'INSERT INTO users(email,user_password) VALUES($1,$2)',
        values: [newUser.email, newUser.passwordHash],
    };
    client.query(query, callback)

}

module.exports.getRegisteredUsers = getRegisteredUsers;
module.exports.newUserRegistered = newUserRegistered;
module.exports.newUserRegisteredBD = newUserRegisteredBD;