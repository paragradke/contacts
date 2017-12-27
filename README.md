*signup*
    PATH : /signup
    Method : POST
    Parameters (Application Json)
        email*
        password*
    
    Headers :
        Content-Type : Application Json

    Sample Req :
        {
	        "email": "parag@go.com",
	        "password" : "ksjdskjs2"
        }
    Sample Response :
        {
            "email": "parag@go2.com",
            "password": "ksjdskjs2",
            "contacts": [],
            "_id": "5a438f2590e6d6aa1ee4c6a4"
        }

*login*
    PATH : /login
    Method : POST
    Parameters (Application Json)

    Parameters (Application Json)
        email*
        password*
    
    Headers :
        Content-Type : Application Json

    Sample Req :
        {
	        "email": "parag@go.com",
	        "password" : "ksjdskjs2"
        }
    Sample Response :
        {
            "token": "CuuLrrgnZnIJ",
            "user": {
                "email": "parag@go.com",
                "password": "ksjdskjs"
            },
            "_id": "5a43674330ca9ea4019074dd"
        }


*upload*
    PATH : /upload
    Method : POST
    Parameters Multipart Formdata 
        contacts *
    
    Headers :
        token : token received in the login response

    
    Sample Response :
        {
            "success": "File upload was successful"
        }


*contacts*
    PATH : /contacts
    Method : GET
    Parameters :
        NA
    
    Headers :
        token : token received in the login response

    
    Sample Response :
        [
            {
                "firstName": "Caren",
                "lastName": "Maraga",
                "email": "cmaraga0@joomla.o rg",
                "phone": "31-(763)920-3513"
            },
            {
                "firstName": "Osbert",
                "lastName": "Palethorpe",
                "email": "opalethorpe2 @yahoo.com",
                "phone": "62-(422)273-0456"
            },
            {
                "firstName": "Hilda",
                "lastName": "Itzkovitch",
                "email": "hitzkovitch4@ issuu.com",
                "phone": "351-(784)622-2553"
            },
            {
                "firstName": "Keenan",
                "lastName": "Drewett",
                "email": "kdrewett3@mlb.c om",
                "phone": "55-(826)802-0305"
            },
            {
                "firstName": "Ari",
                "lastName": "Goligly",
                "email": "agoligly6@g.co",
                "phone": "251 -(832)852-7504"
            },
            {
                "firstName": "Shaw",
                "lastName": "Cuell",
                "email": "scuell5@unesco.org",
                "phone": "55-(350)349-7608"
            },
            {
                "firstName": "Ianthe",
                "lastName": "Kerby",
                "email": "ikerby1@xinhuanet .com",
                "phone": "7-(611)638-1531"
            },
            {
                "firstName": "Killy",
                "lastName": "Troucher",
                "email": "ktroucher7@info seek.co.jp",
                "phone": "504-(310)260-6149"
            },
            {
                "firstName": "Novelia",
                "lastName": "Cutchie",
                "email": "ncutchie8@amaz onaws.com",
                "phone": "62-(721)244-4118"
            },
            {
                "firstName": "Lynsey",
                "lastName": "Heball",
                "email": "lheball9@hostgat or.com",
                "phone": "86-(461)698-0355"
            }
        ]

*search*
    PATH : /search
    Method : GET
    Parameters :
        firstName*
        lastName*
    
    Headers :
        token : token received in the login response
        Content-Type : Application Json

    
    Sample Request:
    {
        "firstName" : "Osbert",
        "lastName" : "Palethorpe"
    }


    Sample Response:
    [
        {
            "firstName": "Osbert",
            "lastName": "Palethorpe",
            "email": "opalethorpe2 @yahoo.com",
            "phone": "62-(422)273-0456"
        }
    ]