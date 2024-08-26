Install dependencies of Client and Server side using - npm i

Signup  http://localhost:3000/signup
Login   http://localhost:3000/Login

In home Enter the username of player you want to challenge

If(challenge.accepted){
    game will start
    Timer of 30sec allow to set your pieces in first row
    After 30sec you con move pieces by command
    command format - {H1:F, H1:B, H1:L, H1:R}
                     {P1:F, P1:B, P1:L, P1:R}
                     {H2:FR, H2:BR, H2:FL, H2:BL}
}else{
    game will not start
}