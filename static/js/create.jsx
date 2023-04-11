

function SearchFilter(){
}

function CreateForm(){
    return (
        <form>
            <div className="form-group">

            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    );
}

function Display(){
    const [characterName, setCharacterName] = React.useState([])

    function filterFunction(){
        let input = document.getElementById("myInput");
        let filter = input.value.toUpperCase();
        cosnt searchInput = {name: filter};
        return searchInput;
    }

    React.useEffect(() => {
        fetch('/find_character',{
            method: 'POST',
            body: JSON.stringify()
        })
        .then((response)=>response.json())
        .then((severData)=>{
            setShows(severData.data.Page.media);
        });
    }, []);

    return (
        <div className="row">
            <h1>This is the creation page</h1>
            <div className="dropdown">
                <div id="myDropdown" className="dropdown-content">
                    <input type="text" placeholder="Search.." id="myInput" onKeyUp={filterFunction}/>
                </div>
            </div>
        </div>

    );
}

ReactDOM.render(<Display />, document.getElementById("create"));