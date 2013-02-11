using System.Collections.Generic;
using System.Web.Http;
using ToDo.Services.Controllers.Attributes;
using ToDo.Services.Repository;

namespace ToDo.Services.Controllers
{
     [AllowCrossSiteJson]
    public class MetaController : ApiController
    {
        private readonly IDataRepository _dataRepository;

        public MetaController(IDataRepository dataRepository)
        {
            _dataRepository = dataRepository;
        }

        [HttpGet]
        public IEnumerable<Models.Priority> Priorities()
        {
            return _dataRepository.Properties();
        }

        [HttpGet]
        public IEnumerable<Models.Category> Categories()
        {
            return _dataRepository.Categories();
        }

        [HttpGet]
        public IEnumerable<Models.Status> Statuses()
        {
            return _dataRepository.Statuses();
        }
    }
}