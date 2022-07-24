import "./library.css";
import React from "react";
import "./main.css";
import { SessionContext } from "./library";
import { Header } from "./header";
import {api} from './library';

function EditUserInfo(){
  const [email, setEmail]=React.useState("")
  const [phone, setPhone]=React.useState("")
  const [name, setName]=React.useState("")
  const [image, setImage]=React.useState("")
  const [session, setSession] = React.useContext(SessionContext)
 
  React.useEffect(()=>{
    api('/get_user_detail', {"user_ki_id": session.login_key.id},function(backend_output) {
      if("error" in backend_output){
        alert(backend_output.error) 
      }
      else{
        setEmail(backend_output.user_info.email)
        setPhone(backend_output.user_info.phone)
        setName(backend_output.user_info.name)
        setImage(backend_output.user_info.image)
        console.log('backend_output.user_info.email', backend_output.user_info.email)
      }	
    }) 
  }, [])

  const profileDetailUpdate = function(){
    api('/update_user_details',{"name":name, "email":email, "phone": phone, "image":image}, function(backend_output){
      setSession(backend_output.session)
    });
  }
  return (
    <div
      id="account"
      className=" "
      style={{
        color: "#333",
        marginBottom: "25px",
        borderRadius: "4px",
        padding: "20px",
        boxShadow: "2px 2px 5px #888888",
        backgroundColor: "#fff",
      }}
    >
      <div style={{}}>
        <div
          style={{
            fontSize: "25px",
            fontWeight: "300px",
            padding: "1px 5px",
            color: "#006666",
          }}
        >
          Profile Details
        </div>
        <div style={{ marginTop: "25px" }}>
          <div style={{ padding: "7px", marginBottom: "10px" }}>
            <span
              className="material-icons"
              style={{
                color: "#ccc",
                fontSize: "20px",
                verticalAlign: "bottom",
                marginRight: "5px",
              }}
            >
              email
            </span>
            <input
              type="text"
              value={email}
              className="email_contact_input"
              disabled="true"
            />
          </div>
          <div style={{ padding: "7px", marginBottom: "10px" }}>
            <span
              className="material-icons"
              style={{
                color: "#ccc",
                fontSize: "20px",
                verticalAlign: "bottom",
                marginRight: "5px",
              }}
            >
              person
            </span>
            <input
              type="text"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              className="email_contact_input"
            />
          </div>
          <div style={{ padding: "7px", marginBottom: "10px" }}>
            <span
              className="material-icons"
              style={{
                color: "#ccc",
                fontSize: "20px",
                verticalAlign: "bottom",
                marginRight: "5px",
              }}
            >
              phone
            </span>
            <input
              type="text"
              value={phone}
              onChange={(e)=> setPhone(e.target.value)}
              className="email_contact_input"
            />
          </div>
          <div style={{ padding: "7px", marginBottom: "15px" }}>
            <div style={{ marginLeft: "20px", marginRight: "20px" }}>
              <div className="hsplit">
                <div
                  style={{
                    marginRight: "7px",
                    width: "20%",
                    marginBottom: "8px",
                    textAlign: "center",
                  }}
                >
                  <img
                    style={{
                      maxHeight: "50px",
                      maxWidth: "100%",
                      verticalAlign: "middle",
                    }}
                    src={image}
                  />
                </div>
                <div style={{ width: "37%", marginTop: "7px" }}>
                  <input
                    type="file"
                    name="name"
                    ng-model="image_file"
                    id="image_file"
                    className="input"
                    onchange="angular.element(this).scope().upload_image()"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="login_button_div btn btn-primary active"
        style={{
          textAlign: "left",
          marginTop: "20px",
          paddingLeft: "32px",
        }}
      >
        {/* <img
          src="https://i.gifer.com/ZZ5H.gif"
          style={{
            width: "15px",
            color: "blue",
            margin: "2px",
            verticalAlign: "middle",
          }}
        /> */}
        <button
          className="login_button"
          onClick={profileDetailUpdate}
        >
          Save
        </button>
      </div>
    </div>
  );
}

function UpdatePassword(){
  const [oldPassword, setOldPassword]= React.useState("")
  const [newPassword, setNewPassword]= React.useState("")
  const [repeatPassword, setRepeatPassword]= React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)

  const update_password = function(){
		api('/update_password', {"old_password":oldPassword, "new_password":newPassword, "repeat_password":repeatPassword},function(backend_output) {
			if("error" in backend_output){
        alert(backend_output.error)
				console.log("backend_output.error==",backend_output.error )
			}
			else{
        setOldPassword("")
        setNewPassword("")
        setRepeatPassword("")
				alert("update password")
			}
		})
	}

  return (
  <div
    id="password"
    className=" "
    style={{
      color: "#333",
      marginBottom: "25px",
      borderRadius: "4px",
      padding: "20px",
      boxShadow: "2px 2px 5px #888888",
      backgroundColor: "#fff",
    }}
  >
    <div style={{}}>
      <div
        style={{
          fontSize: "25px",
          fontWeight: "300px",
          padding: "1px 5px",
          color: "#006666",
        }}
      >
        Password
      </div>
      <div style={{ borderBottom: "solid #eee 1px" }} />
      <div style={{ marginTop: "25px" }}>
        <div style={{ padding: "0px 7px", fontSize: "12px" }}>
          Old Password
        </div>
        <div style={{ padding: "7px", marginBottom: "10px" }}>
          <input
            type={showPassword ? 'text':'password'}
            value={oldPassword}
            onChange={(e)=> setOldPassword(e.target.value)}
            className="email_contact_input"
          />
        </div>
      </div>
      <div style={{ marginTop: "25px" }}>
        <div style={{ padding: "0px 7px", fontSize: "12px" }}>
          New Password
        </div>
        <div style={{ padding: "7px", marginBottom: "10px" }}>
          <input
            type={showPassword ? 'text':'password'}
            value={newPassword}
            onChange={(e)=> setNewPassword(e.target.value)}
            className="email_contact_input"
          />
        </div>
      </div>
      <div style={{ marginTop: "25px" }}>
        <div style={{ padding: "0px 7px", fontSize: "12px" }}>
          Repeat password
        </div>
        <div style={{ padding: "7px", marginBottom: "10px" }}>
          <input
            type={showPassword ? 'text':'password'}

            value={repeatPassword}
            onChange={(e)=> setRepeatPassword(e.target.value)}                    
            className="email_contact_input"
          />
        </div>
      </div>
      <div style={{ paddingTop: "8px" }}>
        <label>
          {" "}
          <input type="checkbox" defaultChecked={showPassword} onChange={()=> setShowPassword(!showPassword)}  />
          Show Password
          {showPassword}
        </label>
      </div>
    </div>
    <div
      className="login_button_div btn btn-primary active"
      style={{ textAlign: "left", marginTop: "20px", paddingLeft: "5px" }}
    >
      {/* <img
        src="https://i.gifer.com/ZZ5H.gif"
        style={{
          width: "15px",
          color: "blue",
          margin: "2px",
          verticalAlign: "middle",
        }}
        ng-if="loading_update_password==true"
      /> */}
      <button
        className="login_button"
        onClick={update_password}
      >
        Update Password
      </button>
    </div>
  </div>
  );
}

export function EditProfile() { 
  return (
    <>
      <Header/>
      <div className="hsplit bigest_div" style={{ marginTop: "10px" }}>
        <div className="col-lg-2 col-sm-2 col-xs-1" />
        <div
          className="proflie_page_right_div col-lg-8 col-sm-8 col-xs-10">
        <EditUserInfo/>
        <UpdatePassword/>
        </div>
      </div>
    </>
  );
}
