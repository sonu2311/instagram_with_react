Database Commands:
CREATE DATABASE instagram2;
create table users ( id serial primary key,name varchar(100),email varchar(100), phone varchar(100), password varchar(100),image varchar(100), role varchar(20), account_status varchar(100));

create table posts ( id serial primary key,post_text varchar(1000),post_time int, user_id int);

create table comments ( id serial primary key,post_id int, user_id int, comment_time int, comment_text varchar(1000));

create table notifications ( id serial primary key,content varchar(1000), user_id int);

create table follows (user_id int, follow_id int );

create table likes (post_id int, user_id int);

create table dislikes (post_id int, user_id int);

create table blocks (user_id int, blocked_person_id int );

ALTER TABLE posts ADD post_image varchar(1000);

ALTER TABLE table_name
ADD column_name datatype;

select count(comment_text) as num_comments, post_id from comments Group by(post_id)
select count(user_id) as num_post_likes_user, post_id from likes Group by(post_id)

insert into posts (product_id  ,quantity ,user_id ) values ({product_id}, {product_quantity})

insert into friends (user_id, friend_id ) values ({login}, { user_id})

insert into notifications (content, user_id ) values ({content}, {user_id})

SELECT  comments.*, users.name FROM users left join  comments on comments.user_id= users.id
			WHERE 
				comments.post_id={post_id} 
			ORDER by id DESC 

-- SELECT notifications.*, users.image FROM notifications left join users on notifications.user_id= users.id WHERE notifications.user_id = {user_id}  ORDER BY id DESC limit 5

SELECT 
				follows.*, users.name, users.image  
			FROM follows 
			LEFT JOIN 
				users ON  follows.user_id=users.id 
			WHERE 
				follows.follow_id= {input_se_aayi_hui_user_id}


SELECT  follows.*, users.name, users.image FROM follows left join  users on follows.user_id= users.id
			WHERE 
				comments.post_id={post_id} 
			ORDER by id DESC 

UPDATE posts
SET  post_text = {post_text}
WHERE posts.id = {post_id};

DELETE FROM posts WHERE posts.id={post_id};
delete from friends where user_id= 3

DROP TABLE friends;


SELECT * FROM posts WHERE posts.user_id = {user_id}

SELECT posts.*,users.name,users.image,COALESCE(num_comments_per_post.num_comments, 0) as num_comments, COALESCE(num_likes_per_post.num_post_likes_user, 0) as num_post_likes_user FROM posts LEFT JOIN users ON users.id= posts.user_id LEFT JOIN (
    SELECT count(comment_text) as num_comments, post_id FROM comments GROUP BY(post_id)) as num_comments_per_post ON num_comments_per_post.post_id = posts.id  LEFT JOIN (select count(user_id) as num_post_likes_user ,max(CASE WHEN user_id =login_id(session) THEN 1 ELSE 0 END) as is_self_like, post_id from likes Group by(post_id) as num_likes_per_post ON num_likes_per_post.post_id = posts.id
)
ORDER BY id DESC


 select count(user_id) as num_post_likes_user ,max(CASE WHEN user_id =login_id(session) THEN 1 ELSE 0 END) as is_self_like, post_id from likes Group by(post_id);

select follows.*, users.name, users.image  from follows left join on users follows.user_id=users.id where follows.follow_id= {input_se_aayi_hui_user_id}


query1 = """
     SELECT
       posts.*,
       users.name,
       users.image,
       COALESCE(num_comments_per_post.num_comments, 0) as num_comments
     FROM posts
       LEFT JOIN users
         ON users.id= posts.user_id
       LEFT JOIN (
           SELECT
               count(comment_text) as num_comments,
               post_id
           FROM comments
           GROUP BY(post_id)
         ) as num_comments_per_post
           ON num_comments_per_post.post_id = posts.id
       ORDER BY id DESC"""









select orders*,users.name AS farmer_name from orders left join users on users.id= farmer_id where id={order_id}

select orders.* ,users.name,farmers.name as farmers_name,farmers.address as farmer_address, addresses.address form orders left join users on orders.user_id = users.id left join addresses on orders.address_id=addresses.id left join users as farmers on orders.farmer_id= farmers.id 

ALTER TABLE addresses ADD COLUMN latitude real;

query="select posts.*, users.name, users.image from posts left join users on users.id= posts.user_id"
posts:
	id - int , automatic increase
	post_text -varchar(1000)
	post_time - int
	user_id - int
	(jisne post k),(users.image)(users.name)
comments:
	id - int , automatic increase
	post_id - int
	(jis post pr comment kiya h)
	user_id - int
		Comment karne wale ka name or photo(users table se)
	comment_time - int
	comment_text - varchar (1000)


"select comments.*, posts.name, users.image from posts left join users on users.id= posts.user_id"
