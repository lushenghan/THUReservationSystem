/**
 * Created by Ash on 2016/12/9.
 */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({entended: false}));
app.use(express.static('public'));
app.use(cookieParser());
app.set("view engine", "ejs");
app.set('views', __dirname + '/views');
app.use(partials());

app.use(session({
    secret: 'AshTestSession',
    cookie: {maxAge: 60 * 1000},  //暂定有效期为1分钟
    resave: false,
    saveUninitialized: true
}));


app.route('/test').get(function (req, res) {
    res.send('hello');
});


app.get('/AshTestLoginPageShow', function (req, res) {   //此部分用于测试
    //res.send("This is Ash's Test Login Page.");
    res.render("index.ejs", {
        "title": "test", "laytout": false, "labels": [
            {"username": "AAA", "url": "./EditStudentId", "describe": "学生证", "realName": "AAAA"},
            {"username": "BBB", "url": "./EditStudentId", "describe": "学生证", "realName": "BBBB"},
            {"username": "CCC", "url": "./EditStudentId", "describe": "学生证", "realName": "CCCC"}
        ]
    });
});

app.get('/Logout', function (req, res) {
    if (req.session.sign) {
        req.session.sign = false;
        req.session.superManager = false;
        res.sendFile(__dirname + "/public/" + "Logout.html");
    } else {
        //res.send("Access denied!");
        res.sendFile(__dirname + "/public/" + "AccessDenied.html");
    }
});

app.get('/Main', function (req, res) {
    res.sendFile(__dirname + "/public/" + "Main.html");
});

app.get('/THU_SM_Login', function (req, res) {
    res.sendFile(__dirname + "/public/" + "THU_RSystemSuperManagerLogin.html");
});

app.get('/THU_U_Login', function (req, res) {
    res.sendFile(__dirname + "/public/" + "THU_RSystemUserLogin.html");
});

app.get('/EditStudentId', function (req, res) {
    if (req.session.sign) {
        req.session.currentUserEditLabel = "studentId";
        res.render("EditUserInfo.ejs", {"title": req.session.currentUserInfo.studentId, "laytout": false});
    } else {
        //res.send("Access denied!");
        res.sendFile(__dirname + "/public/" + "AccessDenied.html");
    }
});

app.get('/EditRealName', function (req, res) {
    if (req.session.sign) {
        req.session.currentUserEditLabel = "realName";
        res.render("EditUserInfo.ejs", {"title": req.session.currentUserInfo.realName, "laytout": false});
    } else {
        //res.send("Access denied!");
        res.sendFile(__dirname + "/public/" + "AccessDenied.html");
    }
});

app.get('/EditPhone', function (req, res) {
    if (req.session.sign) {
        req.session.currentUserEditLabel = "phone";
        res.render("EditUserInfo.ejs", {"title": req.session.currentUserInfo.phone, "laytout": false});
    } else {
        //res.send("Access denied!");
        res.sendFile(__dirname + "/public/" + "AccessDenied.html");
    }
});

app.get('/EditInfoPassword', function (req, res) {
    if (req.session.sign) {
        req.session.currentUserEditLabel = "infoPassword";
        res.sendFile(__dirname + "/public/" + "EditPassword_Check.html");
    } else {
        //res.send("Access denied!");
        res.sendFile(__dirname + "/public/" + "AccessDenied.html");
    }
});

app.get('/EditPassword', function (req, res) {
    if (req.session.sign) {
        req.session.currentUserEditLabel = "password";
        res.sendFile(__dirname + "/public/" + "EditPassword_Check.html");
    } else {
        //res.send("Access denied!");
        res.sendFile(__dirname + "/public/" + "AccessDenied.html");
    }
});

app.post('/CheckComplete', function (req, res) {
    console.log(req.body.password);
    if (req.session.sign) {
        console.log(req.body.password);
        if (req.body.password === req.session.currentUserInfo.password) {
            res.sendFile(__dirname + "/public/" + "EditPassword_Input.html");
        } else {
            res.render("UserLoginSucceeded.ejs", {
                "title": req.session.currentUserInfo.username + "     密码错误，已返回用户信息页面", "laytout": false, "userInfos": [
                    {"url": "./EditStudentId", "label": "学生证号", "info": req.session.currentUserInfo.studentId},
                    {"url": "./EditRealName", "label": "真实姓名", "info": req.session.currentUserInfo.realName},
                    {"url": "./EditPhone", "label": "电话", "info": req.session.currentUserInfo.phone}
                ]
            });
        }
    } else {
        //res.send("Access denied!");
        res.sendFile(__dirname + "/public/" + "AccessDenied.html");
    }
});

app.post('/EditComplete', function (req, res) {
    console.log(req.originalUrl);
    //console.log(req.url);
    console.log(req.body.userChangeInfo);
    //res.send("User Info Get!");
    var fileData;
    fileData = fs.readFileSync(privatePath + "User_Info.json");
    var userInfo = JSON.parse(fileData);
    //var userNum = Number(JSON.parse(fileData).currentUserNum);
    var userNum = req.session.currentUserNum;
    //var userEditLabel = JSON.parse(fileData).currentUserEditLabel;
    var userEditLabel = req.session.currentUserEditLabel;

    userInfo.localUser[userNum][userEditLabel] = req.body.userChangeInfo;
    req.session.currentUserInfo = userInfo.localUser[userNum];
    //console.log(userInfo);
    fs.writeFile(privatePath + "User_Info.json", JSON.stringify(userInfo, null, 1), function (err, data) {
        if (err) {
            return console.error(err);
        }
    });

    res.render("UserLoginSucceeded.ejs", {
        "title": req.session.currentUserInfo.username, "laytout": false, "userInfos": [
            {"url": "./EditStudentId", "label": "学生证号", "info": req.session.currentUserInfo.studentId},
            {"url": "./EditRealName", "label": "真实姓名", "info": req.session.currentUserInfo.realName},
            {"url": "./EditPhone", "label": "电话", "info": req.session.currentUserInfo.phone}
        ]
    });
});

app.get('/AddUserInfo', function (req, res) {
    res.sendFile(__dirname + "/public/" + "AddUserInfo.html");
    //req.assert('Test');
});

app.post('/FillUserInfo', function (req, res) {
    console.log(req.originalUrl);
    console.log(req.body.username);
    console.log(req.body.password);

    var currentUsername = req.body.username;
    var currentPassword = req.body.password;

    var fileData = fs.readFileSync(privatePath + "User_Info.json");
    var userInfo = JSON.parse(fileData);

    var checkSuccess = 1;
    for (var i = 0; i < userInfo.localUser.length; i++) {
        if (currentUsername === userInfo.localUser[i].username) {
            //alert("用户名已存在，请重试！");
            res.sendFile(__dirname + "/public/" + "AddUserInfoFailed.html");
            checkSuccess = 0;
        }
    }

    if (checkSuccess == 1) {
        var newUserInfo = {
            username: currentUsername,
            password: currentPassword,
            studentId: "",
            realName: "",
            infoPassword: "",
            phone: "",
            user_type: "student"
        };

        userInfo.localUser.push(newUserInfo);
        req.session.currentUserInfo = newUserInfo;

        for (var i = 0; i < userInfo.localUser.length; i++) {
            if (currentUsername === userInfo.localUser[i].username) {
                req.session.currentUserNum = i;
                break;
            }
        }

        fs.writeFile(privatePath + "User_Info.json", JSON.stringify(userInfo, null, 1), function (err) {
            if (err) {
                return console.error(err);
            }
        });
        res.sendFile(__dirname + "/public/" + "FillUserInfo.html");
    }
});

app.post('/AddComplete', function (req, res) {
    console.log(req.originalUrl);
    var fileData = fs.readFileSync(privatePath + "User_Info.json");
    var userInfo = JSON.parse(fileData);
    var userNum = req.session.currentUserNum;

    userInfo.localUser[userNum].studentId = req.body.studentId;
    userInfo.localUser[userNum].realName = req.body.realName;
    userInfo.localUser[userNum].infoPassword = req.body.infoPassword;
    userInfo.localUser[userNum].phone = req.body.phone;

    fs.writeFile(privatePath + "User_Info.json", JSON.stringify(userInfo, null, 1), function (err) {
        if (err) {
            return console.error(err);
        }
    });
    req.session.sign = true;
    req.session.currentUserInfo = userInfo.localUser[userNum];
    res.render("UserLoginSucceeded.ejs", {
        "title": req.session.currentUserInfo.username, "laytout": false, "userInfos": [
            {"url": "./EditStudentId", "label": "学生证号", "info": req.session.currentUserInfo.studentId},
            {"url": "./EditRealName", "label": "真实姓名", "info": req.session.currentUserInfo.realName},
            {"url": "./EditPhone", "label": "电话", "info": req.session.currentUserInfo.phone}
        ]
    });
});

app.get('/DeleteUserInfo', function (req, res) {
    if (req.session.sign) {
        var fileData;
        fileData = fs.readFileSync(privatePath + "User_Info.json");
        var userInfo = JSON.parse(fileData);
        var userNum = req.session.currentUserNum;
        userInfo.localUser = userInfo.localUser.slice(0, userNum);
        //console.log(userInfo);
        if (!req.session.superManager) {
            req.session.sign = false;
        }

        fs.writeFile(privatePath + "User_Info.json", JSON.stringify(userInfo, null, 1), function (err) {
            if (err) {
                return console.error(err);
            }
        });
        res.send("本账号删除成功！");
    } else {
        //res.send("Access denied!");
        res.sendFile(__dirname + "/public/" + "AccessDenied.html");
    }
});

app.post('/UserLoginPage', function (req, res) {
    console.log(req.originalUrl);
    console.log(req.url);

    fs.readFile(privatePath + "User_Info.json", function (err, data) {
        if (err) {
            return console.error(err);
        }
        var jsonObj = JSON.parse(data);
        //console.log(jsonObj);
        for (var i = 0; i < jsonObj.localUser.length; i++) {
            if ((req.body.username == jsonObj.localUser[i].username) && (req.body.password == jsonObj.localUser[i].password)) {
                //License = 1;
                req.session.sign = true;
                req.session.currentUserNum = i;
                req.session.currentUserInfo = jsonObj.localUser[i];
                res.render("UserLoginSucceeded.ejs", {
                    "title": req.session.currentUserInfo.username, "laytout": false, "userInfos": [
                        {"url": "./EditStudentId", "label": "学生证号", "info": req.session.currentUserInfo.studentId},
                        {"url": "./EditRealName", "label": "真实姓名", "info": req.session.currentUserInfo.realName},
                        {"url": "./EditPhone", "label": "电话", "info": req.session.currentUserInfo.phone}
                    ]
                });
                break;
            }
        }
        if (!req.session.sign) {
            //res.send("Username/Password wrong!");
            res.sendFile(__dirname + "/public/" + "UserLoginFailed.html");
        }
    });
});

app.post('/SuperManagerLoginPage', function (req, res) {
    console.log(req.originalUrl);
    console.log(req.url);
    fs.readFile(privatePath + "User_Info.json", function (err, data) {
        if (err) {
            return console.error(err);
        }
        var jsonObj = JSON.parse(data);
        //console.log(jsonObj);

        if ((req.body.superManagerUsername == jsonObj.superManager.username) && (req.body.superManagerPassword == jsonObj.superManager.password)) {
            req.session.sign = true;
            req.session.superManager = true;
            //res.send("Login succeed!");
            res.sendFile(__dirname + "/public/" + "SuperManagerLoginSucceeded.html");

            //1秒后自动跳转到信息浏览页面

        } else {
            //res.send("Username/Password wrong!");
            res.sendFile(__dirname + "/public/" + "SuperManagerLoginFailed.html");
        }
    });

});

app.get('/ShowUserInfo', function (req, res) {
    //if (SuperLicense == 1){
    if (req.session.sign) {
        //res.sendFile( __dirname + "/public/" + "User_Info.json" );
        fs.readFile(privatePath + "User_Info.json", function (err, data) {
            if (err) {
                return console.error(err);
            }

            var jsonObj = JSON.parse(data);
            var showList = [{}];
            for (var i = 0; i < jsonObj.localUser.length; i++) {
                showList[i] = {
                    "num": i,
                    "username": jsonObj.localUser[i].username
                }
            }
            console.log(showList);
            res.render("ShowUserInfo.ejs", {"title": "SMCheck", "laytout": false, "existUsers": showList});
        });
        //res.send("Current User Info Get!");
    } else {
        //res.send("Access denied!");
        res.sendFile(__dirname + "/public/" + "AccessDenied.html");
    }
});

app.get('/SMEdit', function (req, res) {
    //if (SuperLicense == 1) {
    if (req.session.sign) {
        console.log(req.query.i);
        req.session.currentUserNum = Number(req.query.i);
        var currentUserNum = req.session.currentUserNum;
        var fileData = fs.readFileSync(privatePath + "User_Info.json");
        var jsonObj = JSON.parse(fileData);
        req.session.currentUserInfo = jsonObj.localUser[currentUserNum];
        console.log(req.session.currentUserInfo);
        res.render("UserLoginSucceeded.ejs", {
            "title": req.session.currentUserInfo.username, "laytout": false, "userInfos": [
                {"url": "./EditStudentId", "label": "学生证号", "info": req.session.currentUserInfo.studentId},
                {"url": "./EditRealName", "label": "真实姓名", "info": req.session.currentUserInfo.realName},
                {"url": "./EditPhone", "label": "电话", "info": req.session.currentUserInfo.phone}
            ]
        });

    } else {
        res.sendFile(__dirname + "/public/" + "AccessDenied.html");
    }
});

var server = app.listen(2836, function () {
    var host = server.address().address;
    /** 访问地址 **/
    var port = server.address().port;
    /** 访问端口 **/

    console.log("应用实例，访问地址为 http://%s:%s", host, port);
});