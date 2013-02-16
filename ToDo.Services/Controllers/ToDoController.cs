using System.Collections.Generic;
using System.Web.Http;
using ToDo.Services.Controllers.Attributes;
using ToDo.Services.Repository;

namespace ToDo.Services.Controllers
{
    [AllowCrossSiteJson]
    public class ToDoController : ApiController
    {
        private readonly IDataRepository _dataRepository;

        public ToDoController(IDataRepository dataRepository)
        {
            _dataRepository = dataRepository;
        }
        
        public IEnumerable<ToDo.Models.ToDo> Get()
        {
            return _dataRepository.AllItems();
        }

        public Models.ToDo Get(int id)
        {
            return _dataRepository.Item(id);
        }

        public void Update(Models.ToDo toDo)
        {
            _dataRepository.Update(toDo);
        }

        [System.Web.Http.HttpDelete]
        public void Delete(int id)
        {
            _dataRepository.Delete(id);
        }
    }
}