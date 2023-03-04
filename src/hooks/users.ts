import { ref } from "vue";
import axios from "axios";
import debounce from "lodash/debounce";

type Data = {
  key: number;
  id: string;
  name: string;
  state: "blank" | "loading" | "success" | "failure";
  fn: (target: Data) => void;
  idSetter: string;
};

async function getUserName(target: Data) {
  try {
    console.log("access!");
    const { data } = await axios.get(`https://jsonplaceholder.typicode.com/users/${target.id}`);
    target.name = data.name;
    target.state = "success";
  } catch {
    target.name = "oops!";
    target.state = "failure";
    alert("oops!");
  }
}

function generateGetUserNameFunc() {
  const _getUserName = debounce(getUserName, 1000);
  console.log("created debounced func");

  return function (target: Data) {
    if (target.id === "") {
      target.name = "";
      target.state = "blank";
      _getUserName.cancel();
      return;
    }
    target.name = "loading...";
    target.state = "loading";
    _getUserName(target);
  };
}

export function useUsers() {
  const org = [1, 2, 3, 4, 5];

  let nextIdx = 6;

  const datas = ref<Data[]>(
    org.map(
      (n): Data => ({
        key: n,
        id: "",
        name: "",
        state: "blank",
        fn: generateGetUserNameFunc(),
        set idSetter(value: string) {
          this.id = value;
          this.fn(this);
        },
      })
    )
  );

  function addRow() {
    datas.value.push({
      key: nextIdx++,
      id: "",
      name: "",
      state: "blank",
      fn: generateGetUserNameFunc(),
      set idSetter(value: string) {
        this.id = value;
        this.fn(this);
      },
    });
  }

  function deleteRow(target: Data) {
    const idx = datas.value.findIndex((d) => d.key === target.key);
    if (idx !== -1) {
      datas.value.splice(idx, 1);
    }
  }

  return { datas, addRow, deleteRow };
}
