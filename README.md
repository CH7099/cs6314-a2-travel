# cs6314-a2-travel
You can run the project by:
1) Opening the console
2) Navigating into the project directory
3) Using php -S localhost:8000 (starts PHP server so that AJAX can actually run)*
4) Entering the following URL in your browser: http://localhost:8000/home.html

There are default values set for the files for user.json and hotel.json (left over from testing). Running the required actions on each page will overwrite them.

*PHP will need to be added to your system PATH environment variable

---------------------------------------------------------------------------------------
1） Install MySQL  
2） Import the database  
    data/db/create_database.sql  
    data/db/users.sql  
3） Edit db.php  
    $servername = "localhost";  
    $username   = "travel_user";   // or root  
    $password   = "Travel123!";    // or your own password  
    $database   = "travel_db";  
4） Start the PHP server       
    php -S localhost:8000  
5） Entering the following URL in your browser: http://localhost:8000/home.html  


-------------------------------------------------------------
Login Accounts You Can Use
These are preloaded via users.sql.

| Phone        |    Password   | First Name | Last Name |
| ------------ | ------------- | ---------- | --------- |
| 222-222-2222 | 222-222-2222  | Alice      | Admin     |
| 333-333-3333 | 333-333-3333  | John       | Miller    |
| 444-444-4444 | 444-444-4444  | Emma       | Brown     |
| 555-555-5555 | 555-555-5555  | Michael    | Clark     |
| 666-666-6666 | 666-666-6666  | Sarah      | Walker    |


Test:
"origin": "San Francisco, CA",
"destination": "Dallas, TX",
one-way: 2024-11-10
return: 2024-11-15







