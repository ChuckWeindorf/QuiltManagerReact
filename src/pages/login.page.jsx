import { setOwnerMode } from "../components/common";
import { checkLogin } from "../components/fetchRoutines";
import { ConditionalMenu } from "../components/common";

function LoginPage() {

        async function handleSubmit(e) {
            e.preventDefault();
            const data = new FormData(e.target);
            let objBody = {"login": data.get("login"),
                           "password": data.get("password")  };
            let vtmpOz = await checkLogin(objBody);
            //console.log(vtmpOz);
            if (vtmpOz == "accepted")
               {
               setOwnerMode();
               navigation.navigate('/')
               }
            };

    return (
        <> 
          <ConditionalMenu/>
          <form onSubmit={handleSubmit}>
            <table>
                <tbody>
              <tr>
                <td>Name:</td>
                <td>  
              <input
                type="text"
                name="login"
                id="login"
              />
              </td>
              </tr>
              <tr>
                <td>Pswd:</td>
                <td>
              <input
                type="password"
                name="password"
                id="password"
              />
              </td>
              </tr>
              <tr><td>
            <button type="submit">Login</button>
            </td></tr>
              </tbody>
            </table>
          </form>
        </>
      );
    }
    //
    export { LoginPage };