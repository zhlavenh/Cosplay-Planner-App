


function NewUserForm(props){
    return (
        <React.Fragment>
        <br/>
        <h1 className="d-flex justify-content-center">Join today!</h1>
        <br/>
        <div className="row">
            <div className="form-group col">
                <label htmlFor="fname">First Name</label>
                <input type="text" className="form-control" placeholder="First Name" id="fname" name="fname" onChange={props.updateInputs}/>
            </div>
            <div className="form-group col">
                <label htmlFor="lname">Last Name</label>
                <input type="text" className="form-control" placeholder="Last Name" id="lname" name="lname" onChange={props.updateInputs}/>
            </div>
        </div>

        <div className="form-group">
            <label htmlFor="email" htmlform="email">Email:</label>
            <input type="text" className="form-control" placeholder="Sample@email.com" id="email" name="email" onChange={props.updateInputs}/>
        </div>

        <div className="form-group">
            <label htmlFor="user_name" htmlform="user_name">Username:</label>
            <input type="text" className="form-control" placeholder="Username" id="user_name" name="user_name" onChange={props.updateInputs}/>
        </div>

        <div className="row">
            <div className="form-group col">
                <label htmlFor="password">Password</label>
                <input type="text" className="form-control" placeholder="Password" id="password" name="password" onChange={props.updateInputs}/>
            </div>
            <div className="form-group col">
                <label htmlFor="password2">Password</label>
                <input type="text" className="form-control" placeholder="Retype Password" id="password2" name="password" onChange={props.updateInputs}/>
            </div>
        </div>
        <br/>        
        </React.Fragment>

    );
}

function ExistUserForm(props){

    return(
        <React.Fragment>
        <br/>
        <h1 className="d-flex justify-content-center">Welcome Back!</h1>
        <br/>
        <div className="row">
            <div className="form-group col">
                <label htmlFor="user_name">Username/Email</label>
                <input type="text" className="form-control" placeholder="Username/Email" id="user_name" name="user_name" onChange={props.updateInputs}/>
            </div>
            <div className="form-group col">
                <label htmlFor="password">Password</label>
                <input type="text" className="form-control" placeholder="Password" id="password" name="password" onChange={props.updateInputs}/>
            </div>
        </div>
        <br/> 
        </React.Fragment>

    );
}

function UserRedir(props){

    return(
        <React.Fragment>
            <div className="d-flex justify-content-center">
                <button type="button" className="create_acct" style={{background: 'none', border: 'none'}}>Forgot User Name?</button>
                <button type="button" className="create_acct" style={{background: 'none', border: 'none'}}>Forgot Password?</button>
            </div><br/>
            <div className="d-flex justify-content-center userStatusForm">
                <p style={{margin: "0em"}}>{props.prompt.introText}</p>
                <button type="button" onClick={props.changeText} className="create_acct" style={{background: 'none', border: 'none'}}>{props.prompt.buttonText}</button>
            </div><br/>
            <div className="d-flex justify-content-center">
                <button className="btn btn-outline-primary" id={props.prompt.status} type="" onClick={props.getFormInputs}>{props.prompt.status}</button>
            </div>
        </React.Fragment>

    );
}


function Display(){
    const initalText = {buttonText: "Create an account.", introText: "New to CP?", status: "Login", currentform: <ExistUserForm updateInputs={updateInputs}/>}
    const initialInputs = {formType: null, user_name: null, password: null, password2: null, fname: null, lname: null, email: null}
    const [prompt, getText] = React.useState(initalText)
    const [formInputs, setInputs] = React.useState(initialInputs)


    function changeText(evt){
        evt.preventDefault();
        if (prompt.introText == "New to CP?"){
            const newUserForm = <NewUserForm updateInputs={updateInputs}/>
            getText({...prompt, buttonText: "Log in!", introText: "Already have an account?", status: "Create Account", currentform: newUserForm});
        }
        else{
            const extUserForm = <ExistUserForm updateInputs={updateInputs}/>
            getText({...prompt, buttonText: "Create an account.", introText: "New to CP?", status: "Log in", currentform: extUserForm});
        }
    }

    function updateInputs(evt){
        evt.preventDefault();
        const fieldID = evt.target.id;
        const fieldValue = evt.target.value;
        setInputs(Object.assign(formInputs, {[fieldID]: fieldValue}));
    }


    function getFormInputs(evt){
        evt.preventDefault();
        const currentFormType = evt.target.id;
        formInputs.formType = currentFormType;

        fetch('/handle_login',{
            method: 'POST',
            body: JSON.stringify(formInputs),
            headers: {'Content-Type': 'application/json',}
        })

        .then((response)=>response.json())
        .then((responseJSON)=>{
            if (responseJSON.status == false){
                alert(responseJSON.message);
            }
            else{

                window.location.href = "/user_account";
            }

        });

    }


    return(
        <form action="/handle_login" method="POST">
            {prompt.currentform}
            <UserRedir changeText={changeText} prompt={prompt} getFormInputs={getFormInputs}/>
        </form>
    ); 


}



ReactDOM.render(<Display />, document.getElementById("login"));