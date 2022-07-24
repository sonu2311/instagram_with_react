import {Header} from './header';
import Post from './post';
import React from 'react';
import { api, useImmer} from './library';
import {SessionContext} from './library';


function Followers(){
  const [allFollowersList, setAllFollowersList]= React.useState([])

  React.useEffect(()=> {
    api("/my_all_followers", {}, function(backend_output){
      console.log("backend_output==", backend_output)
      setAllFollowersList(backend_output.followers_list)
      console.log("backend_output==", backend_output)    
    })
  },[])

  return (
    <>
      <div style={{boxSizing: 'border-box'}} className="col-lg-2 col-md-3  hide-xs hide-sm show-md show-lg">
        <div style={{marginTop: '25px'}}>
          <div style={{marginBottom: '1px', borderBottom: 'solid #ccc 1px', color: '#666', padding: '6px', paddingLeft: '10px'}}> 
            <div className="hsplit">
              <div style={{boxSizing: 'border-box'}}>
                <span className="material-icons" style={{color: '#006666', fontSize: '25px'}}>
                  groups
                </span>
              </div>
              <div style={{paddingLeft: '10px', marginTop: '4px'}}>Friends</div>
            </div>
          </div>
          {allFollowersList.map((x)=>(
            <div key={x.id} className="in_scroll_profile_page_div" style={{}}>
              <a href={"#/profile/" + x.user_id} style={{textDecoration: 'none'}}>
                <div style={{}} className="hsplit">
                  <div style={{textAlign: 'center', overflow: 'hidden', verticalAlign: 'middle', whiteSpace: 'nowrap', borderRadius: '50%'}}>
                    <img style={{height: '40px', width: '40px', verticalAlign: 'middle'}} src={x.image}/>
                  </div>
                  <div style={{color: '#333', marginLeft: '10px', paddingTop: '4px'}}>{x.name}</div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </>  
  );    
}

function Notifications(){
  const [notificationList, setNotificationList] = React.useState([])

  React.useEffect(()=> {
  
    api('/all_notifications', {},function(backend_output) {
      console.log("notification_list = ", backend_output)
      setNotificationList(backend_output["notification_list"])  
    })
  },[])

  return (
    <>
      <div style={{boxSizing: 'border-box'}} className="col-lg-2 col-md-3  hide-xs hide-sm show-md show-lg"> 
        <div style={{marginTop: '25px'}}>
          <div style={{marginBottom: '3px', borderBottom: 'solid #ccc 1px', color: '#666', padding: '6px', paddingLeft: '10px'}}> 
            <div className="hsplit">
              <div style={{boxSizing: 'border-box'}}>
                <span className="material-icons" style={{color: '#006666', fontSize: '20px'}}>
                  notifications
                </span>
              </div>
              <div style={{paddingLeft: '10px', marginTop: '1px'}}>Notifications</div>
            </div>
          </div>
          {notificationList.map((x)=>(
            <div key={x.id} className="in_scroll_profile_page_div" style={{}}>
              <div style={{color: '#333', marginTop: '5px', marginLeft: '10px', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: 'calc(100% - 40px)'}} title={x.content}> {x.content}
              </div>
            </div>
          ))}     
        </div>
      </div>
    </>
  );}


function AddNewPost({setList_of_all_posts}){
  const [session, setSession] = React.useContext(SessionContext)
  const [post_text, setPost_text] = React.useState("")
	const [post_image, setPost_image] = React.useState("") 

  const add_new_post = function(){
		api("/post", { post_text:post_text, post_image :post_image}, function(backend_output){
			setList_of_all_posts(backend_output["list_of_all_posts"])
			setPost_text("")
			setPost_image("")
		})
  }

  const add_new_post2 = function(){
		api("/post", { post_text:post_text, post_image :post_image}, function(backend_output){
      setList_of_all_posts(draft=>{
        draft.unshift(backend_output.new_post)
      })
			setPost_text("")
			setPost_image("")
		})
  }


  return (
    <>
      <div style={{margin: '25px'}}>
        <div style={{color: '#333', marginBottom: '25px', borderRadius: '4px', padding: '10px', boxShadow: '2px 2px 5px #888888', backgroundColor: '#fff'}}> 
          <div style={{marginLeft: '20px', marginRight: '20px'}}>
            <div className="hsplit">
              <div style={{marginRight: '7px', width: '60%', marginBottom: '1px', textAlign: 'center'}}>
                <span className="material-icons" style={{fontSize: '30px', marginTop: '20px', color: '#ccc'}} ng-if="post_image.length==0">
                  photo_camera
                </span>
              </div>
              <div style={{width: '38%', marginTop: '20px'}}>
                <input type="file" name="name" ng-model="image_file" id="image_file" className="input"/>
              </div>
            </div>
          </div>
        </div>
        <div style={{color: '#333', marginBottom: '25px', borderRadius: '4px', padding: '20px', boxShadow: '2px 2px 5px #888888', backgroundColor: '#fff'}}>
          <div className="hsplit" style={{boxSizing: 'border-box'}}>
            <div style={{boxSizing: 'border-box', width: '60px'}}>
              <div style={{marginTop: '6px'}}>
                <div style={{}} className="hsplit">
                  <div style={{height: '40px', width: '40px', textAlign: 'center', overflow: 'hidden', verticalAlign: 'middle', whiteSpace: 'nowrap', borderRadius: '50%', boxSizing: 'border-box'}}>
                    <img style={{height: '40px', width: '40px', verticalAlign: 'middle'}} src={session.login_key.image} />
                  </div>
                </div>
              </div>
            </div>
            <div style={{boxSizing: 'border-box', width: 'calc(100% - 90px)'}}>
              <div style={{marginRight: '20px', textAlign: 'justify', textJustify: 'inter-word'}}>
                <textarea placeholder="Post..." rows={1} style={{outline: 'none', resize: 'none', padding: '10px', lineHeight: '20px', backgroundColor: '#eee', border: 'solid #eee 1px', width: '95%', borderRadius: '18px'}} value={post_text} onChange = {(e) => setPost_text(e.target.value)}/>
              </div>
            </div>
            <div style={{boxSizing: 'border-box', width: '30px', marginTop: '6px'}}>
              <div>
                <span className="material-icons" style={{fontSize: '30px', color: '#006666', cursor: 'pointer'}} onClick={add_new_post}>
                  arrow_circle_right
                </span>
              </div>
            </div>
          </div>	
        </div>		
      </div>
    </>
  )
}

function Home() {
  const [list_of_all_posts, setList_of_all_posts] = useImmer([])

  React.useEffect(()=> {
    api("/all_posts", {}, function(backend_output){
      
      setList_of_all_posts(backend_output.list_of_all_posts)

    })
  },[])

  return (
    <div>
      <Header/>
      <div className="hsplit" style={{boxSizing: 'border-box'}}>
        <Followers/>
        <div className=" col-lg-8 col-md-6 col-sm-12 col-xs-12 " style={{border: 'solid #eee 1px', boxSizing: 'border-box'}}>
          <AddNewPost setList_of_all_posts={setList_of_all_posts} />
          <div style={{margin: '25px'}}>
            {list_of_all_posts.map((post)=>(
              <Post key={post.id} post={post}/>
              )
            )}  
          </div>
        </div>
        <Notifications/>
      </div>
    </div>
  );
}

export default Home;