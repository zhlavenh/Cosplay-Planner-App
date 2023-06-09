


function Header(){
    const [isLoggedIn, setLogIn] =  React.useState(false);


    function loggedIn(evt){
        if (!isLoggedIn){
            window.location.href = "/login";
        } else {window.location.href = "/my-accounts";}
    }

    React.useEffect(()=>{
        fetch('/loggedIn')
        .then((response)=>response.json())
        .then((status)=>{setLogIn(status)});
    }, []);

    return (
        <nav className="navbar navbar-expand-lg" >
            <a className="navbar-brand justify-content-start" href="/" >Cosplay Planner</a>
            <button className="navbar-toggler justify-content-end" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup" >
                <div className="navbar-nav">
                <a className="nav-item nav-link" onClick={loggedIn} >Login</a>
                <a className="nav-item nav-link" href="/my-accounts">My Account</a>
                <a className="nav-item nav-link" href="/my-collections">Collections</a>
                <a className="nav-item nav-link" href="/my-outfits">Outfits</a>
                </div>
            </div>
        </nav>
    );
}

ReactDOM.render(<Header />, document.getElementById("base"));
