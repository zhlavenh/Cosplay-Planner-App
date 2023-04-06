function NewUser(){
    return (
     <h1>You need an account</h1>
    );
}

function ExistUser(){
    return(<h1>you already exist</h1>);
}

function UserStatus(){
    const [status, getStatus] = React.useState("new");

    function setStatus(){
        if (status === "new"){getStatus("old");}
        else{getStatus("new");}
    }

    return(
        <button id="userStatus" type="button" onClick={setStatus}>Current status is: {status}</button>
    );
}
ReactDOM.render(<UserStatus />, document.getElementById("login"));