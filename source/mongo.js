import { format } from "date-fns";
import { mongoURL } from "@env";
import { apikey } from "@env";
import { faL } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";



export const getItems = async () => {
    const p = {
        sort: { "_id": 1 },
        collection: "menu", database: "banhcanhghe", dataSource: "Cluster0"
    };

    const o = {
        method: 'post',
        contentType: 'application/json',
        body: JSON.stringify(p),
        headers: {
            "api-key": apikey,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    try {
        let data = await fetch(mongoURL + "find", o);
        let items = await data.json();

        items = items.documents;
        let Data = {};
        Data.Items = items[0]['Items'];
        Data.Drinks = items[1]['Drinks'];
        Data.Others = items[2]['Others'];

        //  items = JSON.parse(items);



        return Data;
    } catch {
        console.log("getItem loi :", Error);
    }
};

export const getTables = async () => {
    const p = {
        sort: { "sku": 1 },
        collection: "table", database: "banhcanhghe", dataSource: "Cluster0"
    };

    const o = {
        method: 'post',
        contentType: 'application/json',
        body: JSON.stringify(p),
        headers: {
            "api-key": apikey,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    try {
        let data = await fetch(mongoURL + "find", o);
        let Data = await data.json();

        return Data.documents;
    } catch {
        console.log("getItem loi :", Error);
    }
};

export const updateTables = async (data, status, type, subtotal, timestamp) => {
    let payload = {};
    payload[type] = data;
    payload = { status: status, subtotal: subtotal, timestamp: timestamp, ...payload };


    const p = {
        filter: { "type": type },
        update: { "$set": payload },
        collection: "table", database: "banhcanhghe", dataSource: "Cluster0"
    };

    const o = {
        method: 'post',
        contentType: 'application/json',
        body: JSON.stringify(p),
        headers: {
            "api-key": apikey,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    try {
        let res = await fetch(mongoURL + "updateOne", o);
        let data = await res.json();
        if (data.matchedCount >= 1)

            return true
        else false

    } catch {
        console.log("getItem loi :", Error);
    }
};

export const updateItems = async (data, type) => {
    let payload = {};
    payload[type] = data;

    const p = {
        filter: { "name": type },
        update: { "$set": payload },
        collection: "menu", database: "banhcanhghe", dataSource: "Cluster0"
    };

    const o = {
        method: 'post',
        contentType: 'application/json',
        body: JSON.stringify(p),
        headers: {
            "api-key": apikey,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    try {
        let res = await fetch(mongoURL + "updateOne", o);
        res = await res.json();

        if (res.matchedCount >= 1)

            return true
        else false

    } catch {
        console.log("getItem loi :", Error);
    }
};

export const updateLogout = async (logout, login) => {

    const p = {
        filter: { "login": login },
        update: { "$set": { "logout": logout, "status": 0 } },
        collection: "users", database: "banhcanhghe", dataSource: "Cluster0"
    };

    const o = {
        method: 'post',
        contentType: 'application/json',
        body: JSON.stringify(p),
        headers: {
            "api-key": apikey,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    try {
        let res = await fetch(mongoURL + "updateOne", o);
        let data = await res.json();

        if (data.matchedCount >= 1)

            return true
        else false

    } catch {
        console.log("updateLogin loi :", Error);
    }
}

export const insertLogin = async (data) => {

    const p = {
        document: data,
        collection: "users", database: "banhcanhghe", dataSource: "Cluster0"
    };

    const o = {
        method: 'post',
        contentType: 'application/json',
        body: JSON.stringify(p),
        headers: {
            "api-key": apikey,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    try {
        let res = await fetch(mongoURL + "insertOne", o);
        let data = await res.json();

        if (data.insertedId)
            return true
        else false

    } catch {
        console.log("inserLogin loi :", Error);
    }
}

export const getLogin = async (data) => {
    const p = {
        filter: { "email": data, "status": 1 },
        sort: { "_id": -1 },
        limit: 1,
        collection: "users", database: "banhcanhghe", dataSource: "Cluster0"
    };

    const o = {
        method: 'post',
        contentType: 'application/json',
        body: JSON.stringify(p),
        headers: {
            "api-key": apikey,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    try {
        let res = await fetch(mongoURL + "find", o);
        let data = await res.json();
        //  console.log(data.documents);
        return data.documents[0];
    } catch {
        console.log("getLogin loi :", Error);
    }
}

export const insertPayment = async (data) => {


    const p1 = {

        document: data.payment,
        collection: "payments", database: "banhcanhghe", dataSource: "Cluster0"
    };

    const o1 = {
        method: 'post',
        contentType: 'application/json',
        body: JSON.stringify(p1),
        headers: {
            "api-key": apikey,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };
    const p2 = {

        documents: data.sale,
        collection: "sales", database: "banhcanhghe", dataSource: "Cluster0"
    };

    const o2 = {
        method: 'post',
        contentType: 'application/json',
        body: JSON.stringify(p2),
        headers: {
            "api-key": apikey,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };
    try {
        let respay = await fetch(mongoURL + "insertOne", o1);
        let data1 = await respay.json();
        let ressale = await fetch(mongoURL + "insertMany", o2);
        let data2 = await ressale.json();

        if (data1.insertedId && data2.insertedIds)
            return true
    }
    catch {
        console.log("insertPayment loi :", Error);
        return false;
    }
};

export const getPayments = async () => {
    const date = new Date();
    let res = {};
    var op = { hour12: false, year: 'numeric', month: '2-digit', day: '2-digit' };
    const d = date.toLocaleString('en-GB', op);
    const query = { "timestamp": { "$regex": d } };
    const q = [
        {
            "$lookup": {
                "from": "sales",
                "let": { "inv": "$invoice" },
                "pipeline": [{
                    "$match": {
                        "$expr":
                        {
                            "$eq": ["$invoice", "$$inv"]
                        }
                    }
                },
                { $project: { _id: 0, type: 0, timestamp: 0, sku: 0, invoice: 0 } }
                ],
                "as": "sales"
            }
        },
        { "$match": query },
        {
            "$sort": { "invoice": -1 }
        }
    ];

    const p = {
        //filter: query, sort: order, limit: limit,
        pipeline: q,
        collection: "payments", database: "banhcanhghe", dataSource: "Cluster0"
    };
    const o = {
        method: 'post',
        contentType: 'application/json',
        body: JSON.stringify(p),
        headers: {
            "api-key": apikey,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };


    const query1 = [{ "$addFields": { "date": { "$substr": ["$timestamp", 0, 10] } } },
    {
        "$group": {
            "_id": "$date",
            "quantity": { "$sum": 1 },

            "total": { "$sum": "$total" },
            "invoice": { "$max": "$invoice" }
        }

    },
    {
        "$sort": { "invoice": -1 }
    },
    {
        "$limit": 7
    }
    ];

    const payload1 = {
        //filter: query, sort: order, limit: limit,
        pipeline: query1,
        collection: "payments", database: "banhcanhghe", dataSource: "Cluster0"
    };

    const options1 = {
        method: 'post',
        contentType: 'application/json',
        body: JSON.stringify(payload1),
        headers: { "api-key": apikey }
    };

    try {
        let resPay = await fetch(mongoURL + "aggregate", o);
        let resReport4 = await fetch(mongoURL + "aggregate", options1);
        resPay = await resPay.json();
        resReport4 = await resReport4.json();
        res.payments = resPay.documents;
        res.report4 = resReport4.documents


        return res;


    } catch {
        console.log("getPayments loi :", Error);
        return false
    }
}

export const getReport6 = async (m, y) => {
    let res = {};

    /*  if (m < 10) { m = "^0" + m }
      else m = "^" + m;;
      m = m.toString();
      y = y.toString();;
      let query1 = [{
          "$match": {
              "$and":
                  [{ "timestamp": { "$regex": m } }, { "timestamp": { "$regex": y } }
                  ]
          }
      },
      {
          "$group": {
              "_id": "$sku",
              "quantity": { "$sum": "$quantity" },
              "description": { "$min": "$description" },
              "total": { "$sum": { "$multiply": ["$price", "$quantity"] } }
          }
  
      },
      {
          "$sort": { "quantity": -1 }
      }
      ];*/
    var my;
    if (m == "0") { my = ""; }
    else {
        if (m < 10) { m = "0" + m }
        m = m.toString();
        y = y.toString();
        my = m + "/" + y;
    }

    let query1 = [{
        "$match": { "timestamp": { "$regex": my } }
    },
    {
        "$group": {
            "_id": "$sku",
            "quantity": { "$sum": "$quantity" },
            "description": { "$min": "$description" },
            "total": { "$sum": { "$multiply": ["$price", "$quantity"] } }
        }

    },
    {
        "$sort": { "quantity": -1 }
    }
    ];

    const payload1 = {
        //filter: query, sort: order, limit: limit,
        pipeline: query1,
        collection: "sales", database: "banhcanhghe", dataSource: "Cluster0"
    };


    const options1 = {
        method: 'post',
        contentType: 'application/json',
        body: JSON.stringify(payload1),
        headers: {
            "api-key": apikey,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };



    try {
        let res1 = await fetch(mongoURL + "aggregate", options1);

        res1 = await res1.json();
        res.r6 = res1.documents;

        return res
    } catch {
        console.log("getReport6 loi :", Error);
    }



}
export const getReport7 = async (m, y) => {
    let res = {};
    /*   if (m < 10) { m = "^0" + m }
       else m = "^" + m;;
       m = m.toString();
       y = y.toString();
   
       
       const query2 = [{
           "$match": {
               "$and":
                   [{ "timestamp": { "$regex": m } }, { "timestamp": { "$regex": y } }
                   ]
           }
       },
       {
           "$group": {
               "_id": "$type",
               "quantity": { "$sum": 1 },
               "total": { "$sum": "$total" }
           }
       },
       {
           "$sort": { "total": -1 }
       }];*/
    var my;
    if (m == "0") { my = ""; }
    else {
        if (m < 10) { m = "0" + m }

        m = m.toString();
        y = y.toString();
        my = m + "/" + y;
    }


    const query2 = [{
        "$match": { "timestamp": { "$regex": my } }
    }
        ,
    {
        "$group": {
            "_id": "$type",
            "quantity": { "$sum": 1 },
            "total": { "$sum": "$total" }
        }
    },
    {
        "$sort": { "total": -1 }
    }];

    const payload2 = {
        //filter: query, sort: order, limit: limit,
        pipeline: query2,
        collection: "payments", database: "banhcanhghe", dataSource: "Cluster0"
    };



    const options2 = {
        method: 'post',
        contentType: 'application/json',
        body: JSON.stringify(payload2),
        headers: {
            "api-key": apikey,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };


    try {

        let res2 = await fetch(mongoURL + "aggregate", options2);
        res2 = await res2.json();
        res.r7 = res2.documents;
        return res


    } catch {
        console.log("getReport7 loi :", Error);
    }



}
export const getReport4 = async () => {
    let res = {};

    const query1 = [{ "$addFields": { "date": { "$substr": ["$timestamp", 0, 10] } } },
    {
        "$group": {
            "_id": "$date",
            "quantity": { "$sum": 1 },

            "total": { "$sum": "$total" },
            "invoice": { "$max": "$invoice" }
        }

    },
    {
        "$sort": { "invoice": -1 }
    },
    {
        "$limit": 7
    }
    ];


    const payload1 = {
        //filter: query, sort: order, limit: limit,
        pipeline: query1,
        collection: "payments", database: "banhcanhghe", dataSource: "Cluster0"
    };



    const options1 = {
        method: 'post',
        contentType: 'application/json',
        body: JSON.stringify(payload1),
        headers: { "api-key": apikey }
    };

    try {

        let res = await fetch(mongoURL + "aggregate", options1);

        res = await res.json().documents

        return res


    } catch {
        console.log("getReport4 loi :", Error);
    }
}


export const getReport45 = async () => {
    let res = {};

    const query1 = [{ "$addFields": { "date": { "$substr": ["$timestamp", 0, 10] } } },
    {
        "$group": {
            "_id": "$date",
            "quantity": { "$sum": 1 },

            "total": { "$sum": "$total" },
            "invoice": { "$max": "$invoice" }
        }

    },
    {
        "$sort": { "invoice": -1 }
    },
    {
        "$limit": 30
    }
    ];

    const query2 = [
        { "$addFields": { "m": { "$substr": ["$timestamp", 3, 2] }, "y": { "$substr": ["$timestamp", 6, 4] } } },
        {
            "$group": {
                "_id": {

                    "year": "$y",
                    "month": "$m",
                },
                "quantity": { "$sum": 1 },

                "total": { "$sum": "$total" }
            }

        },
        {
            "$sort": { "_id": -1 }
        }

    ];
    const payload1 = {
        //filter: query, sort: order, limit: limit,
        pipeline: query1,
        collection: "payments", database: "banhcanhghe", dataSource: "Cluster0"
    };
    const payload2 = {
        //filter: query, sort: order, limit: limit,
        pipeline: query2,
        collection: "payments", database: "banhcanhghe", dataSource: "Cluster0"
    };


    const options1 = {
        method: 'post',
        contentType: 'application/json',
        body: JSON.stringify(payload1),
        headers: { "api-key": apikey }
    };

    const options2 = {
        method: 'post',
        contentType: 'application/json',
        body: JSON.stringify(payload2),
        headers: { "api-key": apikey }
    };







    try {

        let res1 = await fetch(mongoURL + "aggregate", options1);
        let res2 = await fetch(mongoURL + "aggregate", options2);
        res.r4 = await res1.json().documents
        res.r5 = await res2.json().documents




        return res


    } catch {
        console.log("getReport45 loi :", Error);
    }
}

//Report 1
export const getReport = async () => {
    const date = new Date();
    let res = {};
    var op = { hour12: false, year: 'numeric', month: '2-digit', day: '2-digit' };
    const d = date.toLocaleString('en-GB', op);
    const query = { "timestamp": { "$regex": d } };

    const q = [{ "$match": query },
    {
        "$group": {
            "_id": "$type",
            "quantity": { "$sum": 1 },
            "total": { "$sum": "$total" }
        }
    },
    {
        "$sort": { "total": -1 }
    }
    ];
    const p = {
        //filter: query, sort: order, limit: limit,
        pipeline: q,
        collection: "payments", database: "banhcanhghe", dataSource: "Cluster0"
    };
    const o = {
        method: 'post',
        contentType: 'application/json',
        body: JSON.stringify(p),
        headers: { "api-key": apikey }
    };



    const q1 = [
        {
            "$match": {
                "$and": [
                    {
                        "timestamp": { "$regex": d }
                    },
                    {
                        "sku": {
                            "$regex": "^1"
                        }
                    }
                ]
            }
        },
        {
            "$group": {
                "_id": "$sku",
                "quantity": { "$sum": "$quantity" },
                "description": { "$min": "$description" },
                "total": { "$sum": { "$multiply": ["$price", "$quantity"] } }
            }

        },
        {
            "$sort": { "quantity": -1 }
        }
    ];

    const q2 = [
        {
            "$match": {
                "$and": [
                    {
                        "timestamp": { "$regex": d }
                    },
                    {
                        "sku": {
                            "$regex": "^2"
                        }
                    }
                ]
            }
        },
        {
            "$group": {
                "_id": "$sku",
                "quantity": { "$sum": "$quantity" },
                "description": { "$min": "$description" },
                "total": { "$sum": { "$multiply": ["$price", "$quantity"] } }
            }

        },
        {
            "$sort": { "quantity": -1 }
        }
    ];
    const q3 = [
        {
            "$match": {
                "$and": [
                    {
                        "timestamp": { "$regex": d }
                    },
                    {
                        "sku": {
                            "$regex": "^3"
                        }
                    }
                ]
            }
        },
        {
            "$group": {
                "_id": "$sku",
                "quantity": { "$sum": "$quantity" },
                "description": { "$min": "$description" },
                "total": { "$sum": { "$multiply": ["$price", "$quantity"] } }
            }

        },
        {
            "$sort": { "quantity": -1 }
        }
    ];
    const payload1 = {
        //filter: query, sort: order, limit: limit,
        pipeline: q1,
        collection: "sales", database: "banhcanhghe", dataSource: "Cluster0"
    };

    const payload2 = {
        //filter: query, sort: order, limit: limit,
        pipeline: q2,
        collection: "sales", database: "banhcanhghe", dataSource: "Cluster0"
    };

    const payload3 = {
        //filter: query, sort: order, limit: limit,
        pipeline: q3,
        collection: "sales", database: "banhcanhghe", dataSource: "Cluster0"
    };

    const o1 = {
        method: 'post',
        contentType: 'application/json',
        body: JSON.stringify(payload1),
        headers: { "api-key": apikey }
    };

    const o2 = {
        method: 'post',
        contentType: 'application/json',
        body: JSON.stringify(payload2),
        headers: { "api-key": apikey }
    };

    const o3 = {
        method: 'post',
        contentType: 'application/json',
        body: JSON.stringify(payload3),
        headers: { "api-key": apikey }
    };

    const q4 = [{ "$addFields": { "date": { "$substr": ["$timestamp", 0, 10] } } },
    {
        "$group": {
            "_id": "$date",
            "quantity": { "$sum": 1 },

            "total": { "$sum": "$total" },
            "invoice": { "$max": "$invoice" }
        }

    },
    {
        "$sort": { "invoice": -1 }
    },
    {
        "$limit": 7
    }
    ];

    const q5 = [
        { "$addFields": { "m": { "$substr": ["$timestamp", 3, 2] }, "y": { "$substr": ["$timestamp", 6, 4] } } },
        {
            "$group": {
                "_id": {

                    "year": "$y",
                    "month": "$m",
                },
                "quantity": { "$sum": 1 },

                "total": { "$sum": "$total" }
            }

        },
        {
            "$sort": { "_id": -1 }
        }

    ];
    const p4 = {
        //filter: query, sort: order, limit: limit,
        pipeline: q4,
        collection: "payments", database: "banhcanhghe", dataSource: "Cluster0"
    };
    const p5 = {
        //filter: query, sort: order, limit: limit,
        pipeline: q5,
        collection: "payments", database: "banhcanhghe", dataSource: "Cluster0"
    };


    const o4 = {
        method: 'post',
        contentType: 'application/json',
        body: JSON.stringify(p4),
        headers: { "api-key": apikey }
    };

    const o5 = {
        method: 'post',
        contentType: 'application/json',
        body: JSON.stringify(p5),
        headers: { "api-key": apikey }
    };

    const q6 = [{
        "$match": {
            "$and":
                [{ "timestamp": { "$regex": "" } }, { "timestamp": { "$regex": "" } }
                ]
        }
    },
    {
        "$group": {
            "_id": "$sku",
            "quantity": { "$sum": "$quantity" },
            "description": { "$min": "$description" },
            "total": { "$sum": { "$multiply": ["$price", "$quantity"] } }
        }

    },
    {
        "$sort": { "quantity": -1 }
    }

    ];
    const p6 = {
        //filter: query, sort: order, limit: limit,
        pipeline: q6,
        collection: "sales", database: "banhcanhghe", dataSource: "Cluster0"
    };


    const o6 = {
        method: 'post',
        contentType: 'application/json',
        body: JSON.stringify(p6),
        headers: {
            "api-key": apikey,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    const q7 = [{
        "$match": {
            "$and":
                [{ "timestamp": { "$regex": "" } }, { "timestamp": { "$regex": "" } }
                ]
        }
    },
    {
        "$group": {
            "_id": "$type",
            "quantity": { "$sum": 1 },
            "total": { "$sum": "$total" }
        }
    },
    {
        "$sort": { "total": -1 }
    }];

    const p7 = {
        //filter: query, sort: order, limit: limit,
        pipeline: q7,
        collection: "payments", database: "banhcanhghe", dataSource: "Cluster0"
    };



    const o7 = {
        method: 'post',
        contentType: 'application/json',
        body: JSON.stringify(p7),
        headers: {
            "api-key": apikey,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };


    try {
        let r = await fetch(mongoURL + "aggregate", o);
        let r1 = await fetch(mongoURL + "aggregate", o1);
        let r2 = await fetch(mongoURL + "aggregate", o2);
        let r3 = await fetch(mongoURL + "aggregate", o3);
        let r4 = await fetch(mongoURL + "aggregate", o4);
        let r5 = await fetch(mongoURL + "aggregate", o5);
        let r6 = await fetch(mongoURL + "aggregate", o6);
        let r7 = await fetch(mongoURL + "aggregate", o7);
        r = await r.json();
        r1 = await r1.json();
        r2 = await r2.json();
        r3 = await r3.json();
        r4 = await r4.json();
        r5 = await r5.json();
        r6 = await r6.json();
        r7 = await r7.json();
        res.r = r.documents;
        res.r1 = r1.documents;
        res.r2 = r2.documents;
        res.r3 = r3.documents;
        res.r4 = r4.documents;
        res.r5 = r5.documents;
        res.r6 = r6.documents;
        res.r7 = r7.documents;

        return res
    } catch {
        console.log("getReport loi :", Error);
    }


}

