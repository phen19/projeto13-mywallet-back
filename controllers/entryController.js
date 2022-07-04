import { db, objectId } from "../database/db.js";


export async function entryIn(req, res){
  
    const entry = res.locals.entry
    
    await db.collection('entries').insertOne({...entry});
    res.status(201).send('Entrada salva com sucesso');
  }

export async function entryOut(req, res){
  
    const entry = res.locals.entry;
    
    await db.collection('entries').insertOne({ ...entry});
    res.status(201).send('Entrada salva com sucesso');
  }

export async function getEntries(req, res){
    const session = res.locals.session;    

    let balance = 0;

    const entries = await db
      .collection('entries')
      .find({ userId: new objectId(session.userId) })
      .toArray();

    entries.forEach( async (e) => {
        balance+=e.amount;
    });

   
  

    
  
    res.send({balance: Number(balance).toFixed(2), entries});
}

export async function deleteEntry(req, res){
        const id = req.params.id;
        const { authorization } = req.headers;
        const token = authorization?.replace('Bearer ', '');
    
        try {
            const existingEntry =  await db.collection('entries').findOne({ _id: new objectId(id) })
            if (!existingEntry){
                return res.status(404).send("Não achou o entry");
            }
          /*  const session = await db.collection('sessions').findOne({ token: token });
  
            if (!session) {
            return res.sendStatus(401).send("Sessão não encontrada/expirada");
            }*/
  
    
         await db.collection('entries').deleteOne({ _id: new objectId(id) })
         res.sendStatus(200);
    
        } catch (err) {
          console.error(err);
          res.sendStatus(500);
        }
};