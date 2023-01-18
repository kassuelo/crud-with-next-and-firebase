import Cliente from "../../core/Cliente";
import ClienteRepositorio from "../../core/ClienteRepositorio";
import {
    QueryDocumentSnapshot,
    SnapshotOptions,
    collection,
    deleteDoc,
    doc,
    setDoc,
    addDoc,
    getDoc,
    getDocs,
} from "firebase/firestore";
import { database } from "../config";
export default class ColecaoCliente implements ClienteRepositorio {
    #conversor = {
        toFirestore(cliente: Cliente) {
            return {
                nome: cliente.nome,
                idade: cliente.idade,
            };
        },
        fromFirestore(
            snapshot: QueryDocumentSnapshot,
            options: SnapshotOptions
        ) {
            const dados = snapshot.data(options);
            return new Cliente(dados.nome, dados.idade, snapshot.id);
        },
    };

    async salvar(cliente: Cliente): Promise<Cliente> {
        if (cliente?.id) {
            await setDoc(
                doc(database, "clientes", cliente.id).withConverter(
                    this.#conversor
                ),
                cliente
            );
            return cliente;
        } else {
            const docRef = await addDoc(this.#colecao, cliente);
            const doc = await getDoc(docRef);
            return doc.data();
        }
    }
    async excluir(cliente: Cliente): Promise<void> {
        return await deleteDoc(doc(database, "clientes", cliente.id));
    }
    async obterTodos(): Promise<Cliente[]> {
        const clientesSnapshot = await getDocs(this.#colecao);
        const clientesList =
            clientesSnapshot.docs.map((doc) => doc.data()) ?? [];
        return clientesList;
    }

    #colecao = collection(database, "clientes").withConverter(this.#conversor);
}
