function Hello(){
    return (
        <h1>This is a page for all characters</h1>
    );
}


console.log(Hello);
ReactDOM.render(<Hello />, document.getElementById("characters"));