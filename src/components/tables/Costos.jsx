import CustomTextarea from "../forms/custom_textarea";
import DropdownSelect from "../dropdown/select";
import {RadioButtons} from "../forms/radio_btns"

const Costos = () => {
  return (
    <div className="col mt-4">
      <div className="row">
        <div className="col">
          <p className="text-sans-p-bold">Subtítulo</p>
          <DropdownSelect 
          placeholder="Subtítulos"
          options=""/>
        </div>
        <div className="col">
          <p className="text-sans-p-bold">Item</p>
          <DropdownSelect 
          placeholder="Ítem"
          options=""/>
        </div>
        <div className="col">
          <p className="text-sans-p-bold mb-0">Total Anual</p>
          <p>($M)</p>
          <input></input>
        </div>
        <div className="col">
          <p className="text-sans-p-bold mb-0">Etapa</p>
          <p>(Opcional)</p>
          <DropdownSelect 
          placeholder="Ítem"
          options=""/>
        </div>
        <div className="col">
          <p className="text-sans-p-bold">¿Es transversal?</p>
          <RadioButtons 
          altA="Si"
          altB="No"/>
        </div>
      </div>

      <div className="row">
        <CustomTextarea 
        label="Descripción "
        placeholder="Describe el costo por subtítulo e ítem"
        maxLength={500}/>
      </div>
    </div>
  )
};

export default Costos;
  