import { ref } from "vue";
import axios from "axios";
import debounce from "lodash/debounce";
import type { DebouncedFunc } from "lodash";

type Data = {
  key: number;
  id: string;
  name: string;
  state: "blank" | "loading" | "success" | "failure";
  _fn: DebouncedFunc<(target: Data) => Promise<void>>;
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

export function useUsers() {
  let nextIdx = 1;

  const datas = ref<Data[]>([]);

  function addRow() {
    datas.value.push({
      key: nextIdx++,
      id: "",
      name: "",
      state: "blank",
      _fn: debounce(getUserName, 1000),
      set idSetter(value: string) {
        this.id = value;
        if (value === "") {
          this.name = "";
          this.state = "blank";
          this._fn.cancel();
        } else {
          this.name = "loading...";
          this.state = "loading";
          this._fn(this);
        }
      },
    });
  }

  function deleteRow(target: Data) {
    const idx = datas.value.findIndex((d) => d.key === target.key);
    if (idx !== -1) {
      target._fn.cancel();
      datas.value.splice(idx, 1);
    }
  }

  for (let i = 0; i < 5; i++) {
    addRow();
  }

  return { datas, addRow, deleteRow };
}
